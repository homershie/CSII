import type { LazyExoticComponent, ComponentType } from 'react';

export type Category = 'css-techniques' | 'layouts' | 'components';

export type Status = 'wip' | 'done' | 'archived';

export interface ExperimentMeta {
  slug: string;
  category: Category;
  title: string;
  description: string;
  status: Status;
  tags: string[];
  createdAt: string;
  Component: LazyExoticComponent<ComponentType>;
}

export type ExperimentModule = {
  default: Omit<ExperimentMeta, 'slug' | 'category'>;
};

export const CATEGORIES: readonly Category[] = ['css-techniques', 'layouts', 'components'] as const;

export const CATEGORY_LABELS: Record<Category, string> = {
  'css-techniques': 'CSS Techniques',
  layouts: 'Layouts',
  components: 'Components',
};
