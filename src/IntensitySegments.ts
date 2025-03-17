import { MappedSortedLinkedList } from "./MappedSortedLinkedList";
import { ValidationError } from './errors/ValidationError';

export class IntensitySegments {
  /** 
   * Internal data structure to store segment boundaries.
   * 
   * Points are always maintained in ascending order.
   * 
   * Since we need to insert and remove points frequently, I implemented a mapped linked list to store the points because it's more efficient than an array for this use case.
   */
  private points: MappedSortedLinkedList;

  /**
   * Incremental Difference values for each point.
   * 
   */
  private diffs: Record<number, number> = {};

  constructor() {
    this.points = new MappedSortedLinkedList();
    this.diffs = {};
  }

  private validateInput(from: number, to: number, amount: number): void {
    // Check if numbers are integers
    if (!Number.isInteger(from)) {
      throw new ValidationError(`From value must be an integer, got ${from}`);
    }
    if (!Number.isInteger(to)) {
      throw new ValidationError(`To value must be an integer, got ${to}`);
    }

    // Check for NaN/Infinity
    if (!Number.isFinite(from) || !Number.isFinite(to) || !Number.isFinite(amount)) {
      throw new ValidationError('Values must be finite numbers');
    }

    // Check for null/undefined
    if (from == null || to == null || amount == null) {
      throw new ValidationError('Values cannot be null or undefined');
    }

    // Check range
    if (from >= to) {
      throw new ValidationError(`Invalid range: from (${from}) must be less than to (${to})`);
    }
  }

  /**
   * Adds an amount to the intensity of a range [from, to).
   * 
   * Time complexity: O(lgn)
   * 
   * @param from - Start point (inclusive)
   * @param to - End point (exclusive)
   * @param amount - Amount to add to intensity
   */
  public add(from: number, to: number, amount: number): void {
    this.validateInput(from, to, amount);
    if (amount === 0) {
      return;
    }

    if (!this.points.contains(from)) {
      this.points.insert(from);
    }
    if (!this.points.contains(to)) {
      this.points.insert(to);
    }

    this.diffs[from] = (this.diffs[from] || 0) + amount;
    this.diffs[to] = (this.diffs[to] || 0) - amount;

    // Remove any zero diffs
    if (this.diffs[from] === 0) {
      delete this.diffs[from];
      this.points.remove(from);
    }
    if (this.diffs[to] === 0) {
      delete this.diffs[to];
      this.points.remove(to);
    }
  }

  /**
   * Sets the intensity of a range [from, to) to a specific value.
   * 
   * Time complexity: O(lgn)
   * 
   * @param from - Start point (inclusive)
   * @param to - End point (exclusive)
   * @param amount - Intensity value to set
   */
  public set(from: number, to: number, amount: number): void {
    this.validateInput(from, to, amount);
    if (from >= to) {
      return;
    }
    const currentValueOfFromPoint = this.getValueOf(from);
    const currentValueOfToPoint = this.getValueOf(to);

    if (!this.points.contains(from)) {
      this.points.insert(from);
    }
    if (!this.points.contains(to)) {
      this.points.insert(to);
    }

    if (this.points.getFirst() === from) {
      this.diffs[from] = amount;
    } else {
      this.diffs[from] = amount - currentValueOfFromPoint;
    }

    if (this.points.getLast() === to) {
      this.diffs[to] = -amount; 
    } else {
      this.diffs[to] = currentValueOfToPoint - amount;
    }

    // Remove all points and diffs in the range (from, to)
    const pointsToRemove = this.points.toArray().filter(p => p > from && p < to); 
    for (const point of pointsToRemove) {
      if (this.points.contains(point)) {
        this.points.remove(point);
        delete this.diffs[point];
      }
    }
  }

  public getValueOf(point: number): number {
    let currentIntensity = 0;
    for (const boundaryPoint of this.points.toArray()) {
      if (boundaryPoint > point) {
        break;
      }
      currentIntensity += this.diffs[boundaryPoint] || 0;
    }
    return currentIntensity;
  }

  /**
   * Returns a string representation of the segments.
   * 
   * @returns String in format [[point1,intensity1],[point2,intensity2],...]
   */
  public toString(): string {
    const segments: [number, number][] = [];
    let currentIntensity = 0;
    const boundaryPoints = this.points.toArray();

    for (const currentBoundaryPoint of boundaryPoints) {
      const currentDiff = this.diffs[currentBoundaryPoint] || 0;
      if (currentDiff === 0) {
        continue;
      }
      currentIntensity += currentDiff;
      segments.push([currentBoundaryPoint, currentIntensity]);
    }

    return `[${segments.map(([point, intensity]) => `[${point},${intensity}]`).join(',')}]`;
  }
}