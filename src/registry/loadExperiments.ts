import type { ExperimentMeta, ExperimentModule, Category } from './types';
import { parseExperimentPath } from './parseExperimentPath';

const modules = import.meta.glob<ExperimentModule>('/src/experiments/*/*/meta.ts', { eager: true });

export const experiments: ExperimentMeta[] = Object.entries(modules)
  .map(([path, mod]) => {
    const { category, slug } = parseExperimentPath(path);
    return { ...mod.default, slug, category };
  })
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export function byCategory(cat: Category): ExperimentMeta[] {
  return experiments.filter((e) => e.category === cat);
}

export function findExperiment(category: string, slug: string): ExperimentMeta | undefined {
  return experiments.find((e) => e.category === category && e.slug === slug);
}
