import { useState, useMemo } from 'react';
import { byCategory } from '@/registry';
import { CATEGORIES, CATEGORY_LABELS, type Category } from '@/registry/types';
import { CategoryTabs } from '@/components/CategoryTabs';
import { ExperimentCard } from '@/components/ExperimentCard';

const DEFAULT_CATEGORY: Category = CATEGORIES[0]!;

export function HomePage() {
  const [active, setActive] = useState<Category>(DEFAULT_CATEGORY);
  const items = useMemo(() => byCategory(active), [active]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">CSII · UI Lab</h1>
        <p className="text-sm text-ink-muted">CSS 技巧練習、元件實驗、完整切版。瀏覽下方分類。</p>
      </div>

      <CategoryTabs active={active} onChange={setActive} />

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-ink-muted">
          這個分類（{CATEGORY_LABELS[active]}）還沒有實驗。
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((exp) => (
            <ExperimentCard key={`${exp.category}/${exp.slug}`} experiment={exp} />
          ))}
        </div>
      )}
    </div>
  );
}
