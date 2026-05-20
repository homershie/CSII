import { lazy } from 'react';
import type { ExperimentMeta } from '@/registry/types';

const meta: Omit<ExperimentMeta, 'slug' | 'category'> = {
  title: 'Outline Text',
  description: '只有外框的文字效果：-webkit-text-stroke、SVG stroke、text-shadow 三種寫法對照',
  status: 'wip',
  tags: ['css', 'text', 'svg', 'typography'],
  createdAt: '2026-05-19',
  Component: lazy(() => import('./index')),
};

export default meta;
