import Link from 'next/link';

export function SystemState({
  code,
  title,
  description,
  retry,
}: {
  code: string;
  title: string;
  description: string;
  retry?: () => void;
}) {
  return (
    <main className="system-state">
      <p className="eyebrow">{code}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <div>
        {retry && (
          <button className="brand-button" onClick={retry}>
            Try again
          </button>
        )}
        <Link className="brand-button brand-button-outline" href="/">
          Return home
        </Link>
      </div>
    </main>
  );
}
