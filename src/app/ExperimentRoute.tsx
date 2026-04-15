import { useParams } from 'react-router-dom';
import { findExperiment } from '@/registry';
import { StatusBadge } from '@/components/StatusBadge';
import { NotFound } from './NotFound';

export function ExperimentRoute() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const exp = category && slug ? findExperiment(category, slug) : undefined;
  if (!exp) return <NotFound />;
  const { Component, title, description, status, tags } = exp;

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          <StatusBadge status={status} />
        </div>
        <p className="text-sm text-ink-muted">{description}</p>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span key={tag} className="rounded bg-surface-2 px-2 py-0.5 text-xs text-ink-muted">
              #{tag}
            </span>
          ))}
        </div>
      </header>
      <div className="rounded-lg border border-border bg-surface-2 p-6">
        <Component />
      </div>
    </article>
  );
}
