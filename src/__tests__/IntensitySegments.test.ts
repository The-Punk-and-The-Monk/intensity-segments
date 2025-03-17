import { ValidationError } from '../errors/ValidationError';
import { IntensitySegments } from '../IntensitySegments';

describe('IntensitySegments', () => {
  let segments: IntensitySegments;

  beforeEach(() => {
    segments = new IntensitySegments();
  });

  describe('toString', () => {
    it('should return empty array representation for empty segments', () => {
      expect(segments.toString()).toBe('[]');
    });
  });

  describe('add', () => {
    it('should handle basic add operations', () => {
      segments.add(10, 30, 1);
      expect(segments.toString()).toBe('[[10,1],[30,0]]');
    });

    it('should correctly merge overlapping segments', () => {
      segments.add(10, 30, 1);
      segments.add(20, 40, 1);
      expect(segments.toString()).toBe('[[10,1],[20,2],[30,1],[40,0]]');
    });

    it('should handle negative intensity values', () => {
      segments.add(10, 30, 1);
      segments.add(20, 40, 1);
      segments.add(10, 40, -2);
      expect(segments.toString()).toBe('[[10,-1],[20,0],[30,-1],[40,0]]');
    });

    it('should correctly handle the example sequence 1', () => {
      segments.add(10, 30, 1);
      expect(segments.toString()).toBe('[[10,1],[30,0]]');
      
      segments.add(20, 40, 1);
      expect(segments.toString()).toBe('[[10,1],[20,2],[30,1],[40,0]]');
      
      segments.add(10, 40, -2);
      expect(segments.toString()).toBe('[[10,-1],[20,0],[30,-1],[40,0]]');
    });

    it('should correctly handle the example sequence 2', () => {
      segments.add(10, 30, 1);
      expect(segments.toString()).toBe('[[10,1],[30,0]]');
      
      segments.add(20, 40, 1);
      expect(segments.toString()).toBe('[[10,1],[20,2],[30,1],[40,0]]');
      
      segments.add(10, 40, -1);
      expect(segments.toString()).toBe('[[20,1],[30,0]]');
      
      segments.add(10, 40, -1);
      expect(segments.toString()).toBe('[[10,-1],[20,0],[30,-1],[40,0]]');
    });


    it('should ignore zero amount changes', () => {
      segments.add(10, 30, 0);
      expect(segments.toString()).toBe('[]');
    });

    it('should correctly handle adjacent segments with no overlap', () => {
      segments.add(10, 20, 1);
      segments.add(20, 30, 1);
      expect(segments.toString()).toBe('[[10,1],[30,0]]');
    });

    it('should correctly handle multiple overlapping regions', () => {
      segments.add(10, 50, 1);
      segments.add(20, 40, 1);
      segments.add(30, 60, 1);
      expect(segments.toString()).toBe('[[10,1],[20,2],[30,3],[40,2],[50,1],[60,0]]');
    });
  });

  describe('set', () => {
    it('should set intensity for a simple range', () => {
      segments.set(10, 30, 5);
      expect(segments.toString()).toBe('[[10,5],[30,0]]');
    });

    it('should override existing intensity in the range', () => {
      segments.add(10, 40, 2);
      segments.set(20, 30, 5);
      expect(segments.toString()).toBe('[[10,2],[20,5],[30,2],[40,0]]');
    });

    it('should handle setting to zero by removing unnecessary segments', () => {
      segments.add(10, 40, 3);
      segments.set(10, 40, 0);
      expect(segments.toString()).toBe('[]');
    });

    it('should handle partial overlap with existing segments', () => {
      segments.add(10, 50, 2);
      segments.set(30, 70, 5);
      expect(segments.toString()).toBe('[[10,2],[30,5],[70,0]]');
    });

    it('should handle complex overlapping scenarios', () => {
      segments.add(10, 70, 1);
      segments.add(20, 50, 2);
      segments.set(30, 60, 0);
      expect(segments.toString()).toBe('[[10,1],[20,3],[30,0],[60,1],[70,0]]');
    });
  });

  describe('edge cases', () => {
    it('should handle large ranges without issues', () => {
      segments.add(-1000, 1000, 5);
      expect(segments.toString()).toBe('[[-1000,5],[1000,0]]');
    });

    it('should maintain segments in order after operations', () => {
      segments.add(50, 60, 1);
      segments.add(10, 20, 2);
      segments.add(30, 40, 3);
      expect(segments.toString()).toBe('[[10,2],[20,0],[30,3],[40,0],[50,1],[60,0]]');
    });

    it('should handle multiple operations on the same range', () => {
      segments.add(10, 20, 1);
      segments.add(10, 20, 2);
      segments.add(10, 20, -3);
      expect(segments.toString()).toBe('[]');
    });

    describe('boundary values', () => {
      it('should handle negative coordinates', () => {
        segments.add(-20, -10, 1);
        expect(segments.toString()).toBe('[[-20,1],[-10,0]]');
      });

      it('should handle MAX_SAFE_INTEGER boundaries', () => {
        const max = Number.MAX_SAFE_INTEGER;
        segments.add(max - 100, max, 1);
        expect(segments.toString()).toBe(`[[${max-100},1],[${max},0]]`);
      });
    });

    describe('additional number cases', () => {
      it('should handle MIN_SAFE_INTEGER boundaries', () => {
        const min = Number.MIN_SAFE_INTEGER;
        segments.add(min, min + 100, 1);
        expect(segments.toString()).toBe(`[[${min},1],[${min + 100},0]]`);
      });
    });

    describe('boundary behavior', () => {
      it('should handle identical boundaries with different intensities', () => {
        segments.add(10, 20, 1);
        segments.add(10, 20, 2);
        expect(segments.toString()).toBe('[[10,3],[20,0]]');
      });

      it('should handle multiple segments with same boundaries', () => {
        segments.add(10, 20, 1);
        segments.add(10, 20, 2);
        segments.add(10, 20, -3);
        expect(segments.toString()).toBe('[]');
      });
    });

    describe('performance edge cases', () => {
      it('should handle many small adjacent segments', () => {
        for (let i = 0; i < 100; i++) {
          segments.add(i, i + 1, 1);
        }
        expect(segments.toString()).toBe('[[0,1],[100,0]]');
      });

      it('should handle many overlapping segments', () => {
        for (let i = 0; i < 100; i++) {
          segments.add(0, 100 - i, 1);
        }
        expect(segments.toString()).not.toBe('[]');
      });
    });
  });

  describe('input validation', () => {
    it('should throw for non-integer boundaries', () => {
        expect(() => segments.add(10.5, 20, 1)).toThrow(ValidationError);
        expect(() => segments.add(10, 20.5, 1)).toThrow(ValidationError);
    });

    it('should throw for invalid numbers', () => {
        expect(() => segments.add(NaN, 20, 1)).toThrow(ValidationError);
        expect(() => segments.add(Infinity, 20, 1)).toThrow(ValidationError);
        expect(() => segments.add(-Infinity, 20, 1)).toThrow(ValidationError);
    });

    it('should throw for null/undefined values', () => {
        expect(() => segments.add(null as any, 20, 1)).toThrow(ValidationError);
        expect(() => segments.add(undefined as any, 20, 1)).toThrow(ValidationError);
    });

    it('should throw for invalid ranges', () => {
        expect(() => segments.add(20, 10, 1)).toThrow(ValidationError);
        expect(() => segments.add(10, 10, 1)).toThrow(ValidationError);
    });
  });
});