import { CATEGORIES, CATEGORY_LABELS, type Category } from '@/registry/types';

interface Props {
  active: Category;
  onChange: (cat: Category) => void;
}

export function CategoryTabs({ active, onChange }: Props) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-border">
      {CATEGORIES.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat)}
            className={
              isActive
                ? 'border-b-2 border-accent px-4 py-2 text-sm font-medium text-ink'
                : 'border-b-2 border-transparent px-4 py-2 text-sm font-medium text-ink-muted hover:text-ink'
            }
          >
            {CATEGORY_LABELS[cat]}
          </button>
        );
      })}
    </div>
  );
}
