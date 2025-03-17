/**
 * Main entry point for the intensity-segments package
 */

import { IntensitySegments } from "./IntensitySegments";

/**
 * Example usage of the IntensitySegments class
 */
function runExamples(): void {
  // Here is an example sequence:
  // (data stored as an array of start point and value for each segment.)
  const segments1 = new IntensitySegments();
  console.log(segments1.toString()); // Should be "[]"
  segments1.add(10, 30, 1);
  console.log(segments1.toString()); // Should be: "[[10,1],[30,0]]"
  segments1.add(20, 40, 1);
  console.log(segments1.toString()); // Should be: "[[10,1],[20,2],[30,1],[40,0]]"
  segments1.add(10, 40, -2);
  console.log(segments1.toString()); // Should be: "[[10,-1],[20,0],[30,-1],[40,0]]"
  // Another example sequence:
  const segments2 = new IntensitySegments();
  console.log(segments2.toString()); // Should be "[]"
  segments2.add(10, 30, 1);
  console.log(segments2.toString()); // Should be "[[10,1],[30,0]]"
  segments2.add(20, 40, 1);
  console.log(segments2.toString()); // Should be "[[10,1],[20,2],[30,1],[40,0]]"
  segments2.add(10, 40, -1);
  console.log(segments2.toString()); // Should be "[[20,1],[30,0]]"
  segments2.add(10, 40, -1);
  console.log(segments2.toString()); // Should be "[[10,-1],[20,0],[30,-1],[40,0]]"
}

runExamples();
