import type { Status } from '@/registry/types';

const labels: Record<Status, string> = {
  wip: 'WIP',
  done: 'Done',
  archived: 'Archived',
};

const styles: Record<Status, string> = {
  wip: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  done: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  archived: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30',
};

interface Props {
  status: Status;
}

export function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
