import { Link } from 'react-router-dom';
import type { ExperimentMeta } from '@/registry/types';
import { StatusBadge } from './StatusBadge';

interface Props {
  experiment: ExperimentMeta;
}

export function ExperimentCard({ experiment }: Props) {
  const { category, slug, title, description, status, tags } = experiment;
  return (
    <Link
      to={`/${category}/${slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-surface-2 p-5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-ink group-hover:text-accent">{title}</h3>
        <StatusBadge status={status} />
      </div>
      <p className="line-clamp-2 text-sm text-ink-muted">{description}</p>
      <div className="mt-auto flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span key={tag} className="rounded bg-surface px-2 py-0.5 text-xs text-ink-muted">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
