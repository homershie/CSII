import { lazy } from 'react';
import type { ExperimentMeta } from '@/registry/types';

const meta: Omit<ExperimentMeta, 'slug' | 'category'> = {
  title: 'Border Image',
  description: 'CSS border-image 的 stretch / repeat / round 三種模式對照',
  status: 'wip',
  tags: ['css', 'border', 'svg'],
  createdAt: '2026-04-15',
  Component: lazy(() => import('./index')),
};

export default meta;
