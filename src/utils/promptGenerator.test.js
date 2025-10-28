import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateScript } from './promptGenerator';

describe('promptGenerator', () => {
  describe('generateScript', () => {
    beforeEach(() => {
      // Seed Math.random for consistent testing
      let counter = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        counter++;
        return (counter * 0.123) % 1;
      });
    });

    it('should return a message when no concept is provided', () => {
      const result = generateScript('');
      expect(result).toBe('Please provide a concept first.');
    });

    it('should return a message when concept is null', () => {
      const result = generateScript(null);
      expect(result).toBe('Please provide a concept first.');
    });

    it('should generate a script with the provided concept', () => {
      const concept = 'A woman is excited about her new shoes';
      const result = generateScript(concept);

      expect(result).toBeTruthy();
      expect(result).toContain(concept);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should include all three beats in the script', () => {
      const concept = 'A person discovers an amazing product';
      const result = generateScript(concept);

      // Check for elements from each beat
      expect(result).toContain('selfie-mode'); // Hook shot type
      expect(result).toContain('close-up'); // Action shot type
      expect(result).toContain('medium shot'); // Reaction shot type
    });

    it('should include lighting and environment details', () => {
      const concept = 'Testing environment and lighting';
      const result = generateScript(concept);

      expect(result).toMatch(/living room|kitchen|bedroom|outdoor|office/i);
      expect(result).toMatch(/natural|golden hour|soft|backlit/i);
    });

    it('should include final result styles', () => {
      const concept = 'Final result test';
      const result = generateScript(concept);

      expect(result).toContain('Finally, the overall result should be');
    });

    it('should clean up whitespace in the output', () => {
      const concept = 'Whitespace test';
      const result = generateScript(concept);

      // Should not have multiple consecutive spaces
      expect(result).not.toMatch(/  +/);
    });

    it('should generate different scripts for different concepts', () => {
      const concept1 = 'A man discovers a new gadget';
      const concept2 = 'A woman finds the perfect dress';

      const result1 = generateScript(concept1);
      const result2 = generateScript(concept2);

      expect(result1).toContain(concept1);
      expect(result2).toContain(concept2);
      expect(result1).not.toBe(result2);
    });

    it('should include camera movements', () => {
      const concept = 'Camera movement test';
      const result = generateScript(concept);

      expect(result).toMatch(/Handheld|Static|Dolly/i);
    });

    it('should include key UGC visual details', () => {
      const concept = 'UGC details test';
      const result = generateScript(concept);

      // Should have visual details from beats
      expect(result).toContain('Key details include');
    });
  });
});
