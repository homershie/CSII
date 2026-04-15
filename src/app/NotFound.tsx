import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-10">
      <h1 className="text-2xl font-bold text-ink">404</h1>
      <p className="text-sm text-ink-muted">找不到這個實驗。</p>
      <Link to="/" className="text-sm text-accent hover:underline">
        回首頁
      </Link>
    </div>
  );
}
