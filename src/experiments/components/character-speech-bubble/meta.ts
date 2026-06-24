import { lazy } from 'react';
import type { ExperimentMeta } from '@/registry/types';

const meta: Omit<ExperimentMeta, 'slug' | 'category'> = {
  title: 'Character Speech Bubble',
  description:
    '角色對話框壓在景點圖上：白底 div + ::before 三角話尾 + ::after 角色圖，drop-shadow 統一陰影，container query 響應',
  status: 'wip',
  tags: ['component', 'pseudo-element', 'speech-bubble', 'rwd', 'container-query'],
  createdAt: '2026-06-24',
  Component: lazy(() => import('./index')),
};

export default meta;
