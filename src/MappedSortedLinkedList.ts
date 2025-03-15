
// Replace with new implementation
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
    // Map to store value -> node mapping for quick lookup
    private valueMap: Map<number, NumberNode>;

    constructor() {
        this.head = undefined;
        this.tail = undefined;
        this.size = 0;
        this.valueMap = new Map<number, NumberNode>();
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

    /**
     * Inserts a value in the correct sorted position
     * @param value The numeric value to insert
     * @returns true if insertion was successful, false otherwise
     */
    public insert(value: number): boolean {
        // Check if value already exists in list
        if (this.valueMap.has(value)) {
            return false; // Value already exists
        }

        const newNode = new NumberNode(value);
        
        // Case 1: Empty list
        if (this.isEmpty()) {
            this.head = newNode;
            this.tail = newNode;
            this.valueMap.set(value, newNode);
            this.size++;
            return true;
        }
        
        // Case 2: Insert at the beginning (smaller than head)
        if (value < this.head!.value) {
            newNode.next = this.head;
            this.head!.prev = newNode;
            this.head = newNode;
            this.valueMap.set(value, newNode);
            this.size++;
            return true;
        }
        
        // Case 3: Insert at the end (larger than tail)
        if (value > this.tail!.value) {
            newNode.prev = this.tail;
            this.tail!.next = newNode;
            this.tail = newNode;
            this.valueMap.set(value, newNode);
            this.size++;
            return true;
        }
        
        // Case 4: Insert in the middle
        // Find the correct position for insertion (the node just greater than the value)
        let current = this.head;
        while (current && current.value < value) {
            current = current.next;
        }
        
        // At this point, current should be the node just greater than value
        // Insert newNode before current
        newNode.next = current;
        newNode.prev = current!.prev;
        current!.prev!.next = newNode;
        current!.prev = newNode;
        
        this.valueMap.set(value, newNode);
        this.size++;
        return true;
    }

    public remove(value: number): boolean {
        const nodeToRemove = this.valueMap.get(value);
        
        if (!nodeToRemove) {
            return false; // Value not found
        }

        // Update surrounding nodes
        if (nodeToRemove.prev) {
            nodeToRemove.prev.next = nodeToRemove.next;
        } else {
            // Removing head
            this.head = nodeToRemove.next;
        }

        if (nodeToRemove.next) {
            nodeToRemove.next.prev = nodeToRemove.prev;
        } else {
            // Removing tail
            this.tail = nodeToRemove.prev;
        }

        // Remove from map
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
        if (!this.valueMap.has(value)) {
            return -1;
        }

        // We need to traverse the list to find the index
        let index = 0;
        let current = this.head;
        
        while (current) {
            if (current.value === value) {
                return index;
            }
            current = current.next;
            index++;
        }
        
        return -1; // This should never happen if valueMap is accurate
    }

    /**
     * Gets the node at the specified index
     * @param index The index of the node to get
     * @returns The node at the index or null if invalid index
     */
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

    /**
     * Gets the value at the specified index
     * @param index The index of the value to get
     * @returns The value at the index or null if invalid index
     */
    public get(index: number): number | null {
        const node = this.getNodeAt(index);
        return node ? node.value : null;
    }

    /**
     * Finds the smallest value that is greater than or equal to the given value
     * @param value The value to search for
     * @returns The ceiling value or null if no such value exists
     */
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

    /**
     * Finds the largest value that is less than or equal to the given value
     * @param value The value to search for
     * @returns The floor value or null if no such value exists
     */
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

    /**
     * Returns an array representation of the linked list
     * @returns array containing all values in order
     */
    public toArray(): number[] {
        const result: number[] = [];
        let current = this.head;
        
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        
        return result;
    }

    /**
     * Returns a string representation of the linked list
     * @returns String in format [value1,value2,...]
     */
    public toString(): string {
        return `[${this.toArray().join(',')}]`;
    }
}

// Export the classes
export { MappedSortedLinkedList, NumberNode };
