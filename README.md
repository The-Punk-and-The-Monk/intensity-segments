# Intensity Segments

A TypeScript implementation of a class that manages "intensity" by segments on a number line. This implementation focuses on high-quality code, including comprehensive documentation, unit tests, clean code structure, and efficient algorithms.

## Problem Description

This project implements an `IntensitySegments` class that manages intensity values across segments on a number line. 
All intensities start at 0, and the class provides methods to update or set intensity values for specified ranges.


## Testing

To run the tests:

```bash
npm i
npm test
```


## Example Usage

```typescript
const segments = new IntensitySegments();
console.log(segments.toString()); // "[]"

segments.add(10, 30, 1);
console.log(segments.toString()); // "[[10,1],[30,0]]"

segments.add(20, 40, 1); 
console.log(segments.toString()); // "[[10,1],[20,2],[30,1],[40,0]]"

segments.add(10, 40, -2);
console.log(segments.toString()); // "[[10,-1],[20,0],[30,-1],[40,0]]"
```
