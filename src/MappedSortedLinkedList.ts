class NumberNode {
    public value: number;
    public prev?: NumberNode;
    public next?: NumberNode;

    constructor(value: number, prev?: NumberNode, next?: NumberNode) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}

/**
 * A sorted linked list that maintains numeric values in ascending order.
 * Each value must be unique, and the list provides O(1) lookup time.
 */
class MappedSortedLinkedList {
    private head?: NumberNode;
    private tail?: NumberNode;
    private size: number;
    private valueMap: Map<number, NumberNode>;
    private numbers: number[]; // New array for binary search

    constructor() {
        this.head = undefined;
        this.tail = undefined;
        this.size = 0;
        this.valueMap = new Map<number, NumberNode>();
        this.numbers = []; // Initialize empty array
    }

    private binarySearch(value: number): number {
        let left = 0;
        let right = this.numbers.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this.numbers[mid] === value) return mid;
            if (this.numbers[mid] < value) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return left; // Return insertion point
    }

    public length(): number {
        return this.size;
    }

    public isEmpty(): boolean {
        return this.size <= 0;
    }

    public contains(value: number): boolean {
        // Use valueMap for O(1) lookup instead of O(n) traversal
        return this.valueMap.has(value);
    }

    public getFirst(): number | null {
        if (this.head) {
            return this.head.value;
        }
        return null;
    }

    public getLast(): number | null {
        if (this.tail) {
            return this.tail.value;
        }
        return null;
    }

    public insert(value: number): boolean {
        if (this.contains(value)) {
            return false;
        }

        const insertIndex = this.binarySearch(value);
        this.numbers.splice(insertIndex, 0, value);

        const newNode = new NumberNode(value);
        this.valueMap.set(value, newNode);

        if (this.isEmpty()) {
            this.head = this.tail = newNode;
        } else {
            if (insertIndex === 0) {
                newNode.next = this.head;
                this.head!.prev = newNode;
                this.head = newNode;
            } else if (insertIndex === this.size) {
                this.tail!.next = newNode;
                newNode.prev = this.tail;
                this.tail = newNode;
            } else {
                const prevNode = this.getNodeAt(insertIndex - 1)!;
                newNode.next = prevNode.next;
                newNode.prev = prevNode;
                prevNode.next!.prev = newNode;
                prevNode.next = newNode;
            }
        }

        this.size++;
        return true;
    }

    public remove(value: number): boolean {
        const index = this.binarySearch(value);
        if (index >= this.numbers.length || this.numbers[index] !== value) {
            return false;
        }

        this.numbers.splice(index, 1);
        const node = this.valueMap.get(value)!;
        
        if (node.prev) node.prev.next = node.next;
        if (node.next) node.next.prev = node.prev;
        if (node === this.head) this.head = node.next;
        if (node === this.tail) this.tail = node.prev;

        this.valueMap.delete(value);
        this.size--;
        return true;
    }

    public removeFirst(): number | null {
        if (this.isEmpty() || !this.head) {
            return null;
        }

        const value = this.head.value;
        
        // Use the remove method to ensure the valueMap is updated
        this.remove(value);
        
        return value;
    }

    public removeLast(): number | null {
        if (this.isEmpty() || !this.tail) {
            return null;
        }

        const value = this.tail.value;
        
        // Use the remove method to ensure the valueMap is updated
        this.remove(value);
        
        return value;
    }

    public indexOf(value: number): number {
        const index = this.binarySearch(value);
        return (index < this.numbers.length && this.numbers[index] === value) ? index : -1;
    }

    public getNodeAt(index: number): NumberNode | null {
        if (index < 0 || index >= this.size) {
            return null;
        }

        let current: NumberNode | undefined;
        
        // Optimize traversal direction based on index position
        if (index < this.size / 2) {
            // Start from head for first half
            current = this.head;
            let currentIndex = 0;
            
            while (current && currentIndex < index) {
                current = current.next;
                currentIndex++;
            }
        } else {
            // Start from tail for second half
            current = this.tail;
            let currentIndex = this.size - 1;
            
            while (current && currentIndex > index) {
                current = current.prev;
                currentIndex--;
            }
        }
        
        return current || null;
    }

    public get(index: number): number | null {
        const node = this.getNodeAt(index);
        return node ? node.value : null;
    }

    public ceiling(value: number): number | null {
        // If value exists in the list, return it
        if (this.valueMap.has(value)) {
            return value;
        }
        
        // If list is empty or value is greater than the largest element
        if (this.isEmpty() || value > this.tail!.value) {
            return null;
        }
        
        // If value is smaller than the smallest element
        if (value < this.head!.value) {
            return this.head!.value;
        }
        
        // Otherwise, find the smallest value that is greater than the target
        let current = this.head;
        while (current && current.value < value) {
            current = current.next;
        }
        
        return current ? current.value : null;
    }

    public floor(value: number): number | null {
        // If value exists in the list, return it
        if (this.valueMap.has(value)) {
            return value;
        }
        
        // If list is empty or value is smaller than the smallest element
        if (this.isEmpty() || value < this.head!.value) {
            return null;
        }
        
        // If value is larger than the largest element
        if (value > this.tail!.value) {
            return this.tail!.value;
        }
        
        // Otherwise, find the largest value that is less than the target
        let current = this.tail;
        while (current && current.value > value) {
            current = current.prev;
        }
        
        return current ? current.value : null;
    }

    public toArray(): number[] {
        const result: number[] = [];
        let current = this.head;
        
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        
        return result;
    }

    public toString(): string {
        return `[${this.toArray().join(',')}]`;
    }

    public find(value: number): NumberNode | null {
        return this.valueMap.get(value) || null;
    }
}

// Export the classes
export { MappedSortedLinkedList, NumberNode };
