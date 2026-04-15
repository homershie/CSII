import { Suspense } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { byCategory } from '@/registry';
import type { Category } from '@/registry/types';
import { CATEGORY_LABELS } from '@/registry/types';

export function Layout() {
  const location = useLocation();
  const params = useParams<{ category?: Category; slug?: string }>();
  const isHome = location.pathname === '/';
  const siblings = params.category ? byCategory(params.category) : [];

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border bg-surface-2">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
          <Link to="/" className="text-sm font-bold text-ink">
            CSII · UI Lab
          </Link>
          <span className="text-xs text-ink-muted">公司 UI 實驗 &amp; 切版練習</span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-6 py-6">
        {!isHome && params.category && (
          <aside className="w-56 shrink-0">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {CATEGORY_LABELS[params.category]}
            </div>
            <nav className="flex flex-col gap-1">
              {siblings.map((exp) => {
                const active = exp.slug === params.slug;
                return (
                  <Link
                    key={exp.slug}
                    to={`/${exp.category}/${exp.slug}`}
                    className={
                      active
                        ? 'rounded-md border-l-2 border-accent bg-surface-2 px-3 py-1.5 text-sm text-ink'
                        : 'rounded-md border-l-2 border-transparent px-3 py-1.5 text-sm text-ink-muted hover:text-ink'
                    }
                  >
                    {exp.title}
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        <main className="min-w-0 flex-1">
          <Suspense fallback={<div className="text-sm text-ink-muted">載入中…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
