import { CATEGORIES, type Category } from './types';

export interface ParsedPath {
  category: Category;
  slug: string;
}

export function parseExperimentPath(path: string): ParsedPath {
  const parts = path.split('/').filter(Boolean);
  const expIdx = parts.indexOf('experiments');
  if (expIdx === -1 || parts.length < expIdx + 3) {
    throw new Error(`malformed experiment path: ${path}`);
  }
  const category = parts[expIdx + 1] as string;
  const slug = parts[expIdx + 2] as string;
  if (!CATEGORIES.includes(category as Category)) {
    throw new Error(`unknown category "${category}" in path: ${path}`);
  }
  return { category: category as Category, slug };
}
