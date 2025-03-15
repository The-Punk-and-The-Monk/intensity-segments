/**
 * Main entry point for the intensity-segments package
 */

import { IntensitySegments } from './IntensitySegments';

/**
 * Example usage of the IntensitySegments class
 */
function runExamples(): void {
  console.log('Example 1:');
  const segments1 = new IntensitySegments();
  console.log(`Initial state: ${segments1.toString()}`);
  
  segments1.add(10, 30, 1);
  console.log(`After add(10, 30, 1): ${segments1.toString()}`);
  
  segments1.add(20, 40, 1);
  console.log(`After add(20, 40, 1): ${segments1.toString()}`);
  
  segments1.add(10, 40, -2);
  console.log(`After add(10, 40, -2): ${segments1.toString()}`);
  
  console.log('\nExample 2:');
  const segments2 = new IntensitySegments();
  console.log(`Initial state: ${segments2.toString()}`);
  
  segments2.add(10, 30, 1);
  console.log(`After add(10, 30, 1): ${segments2.toString()}`);
  
  segments2.add(20, 40, 1);
  console.log(`After add(20, 40, 1): ${segments2.toString()}`);
  
  segments2.add(10, 40, -1);
  console.log(`After add(10, 40, -1): ${segments2.toString()}`);
  
  segments2.add(10, 40, -1);
  console.log(`After add(10, 40, -1): ${segments2.toString()}`);
  
  console.log('\nExample with set:');
  const segments3 = new IntensitySegments();
  
  segments3.add(10, 50, 2);
  console.log(`After add(10, 50, 2): ${segments3.toString()}`);
  
  segments3.set(20, 40, 5);
  console.log(`After set(20, 40, 5): ${segments3.toString()}`);
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples();
}

// Export the IntensitySegments class for use in other modules
export { IntensitySegments }; 