import { describe, it, expect } from 'vitest';
import { parseExperimentPath } from './parseExperimentPath';

describe('parseExperimentPath', () => {
  it('extracts category and slug from a valid path', () => {
    const result = parseExperimentPath('/src/experiments/css-techniques/border-image/meta.ts');
    expect(result).toEqual({
      category: 'css-techniques',
      slug: 'border-image',
    });
  });

  it('accepts layouts category', () => {
    const result = parseExperimentPath('/src/experiments/layouts/landing-page/meta.ts');
    expect(result).toEqual({ category: 'layouts', slug: 'landing-page' });
  });

  it('accepts components category', () => {
    const result = parseExperimentPath('/src/experiments/components/fancy-button/meta.ts');
    expect(result).toEqual({
      category: 'components',
      slug: 'fancy-button',
    });
  });

  it('throws on unknown category', () => {
    expect(() => parseExperimentPath('/src/experiments/random-thing/foo/meta.ts')).toThrow(
      /unknown category/i,
    );
  });

  it('throws on malformed path', () => {
    expect(() => parseExperimentPath('/totally/wrong.ts')).toThrow();
  });
});
