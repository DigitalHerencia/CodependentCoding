import type { LibraryIcon as LibraryIconName } from '@/lib/libraries';

export function LibraryIcon({ name }: { name: LibraryIconName }) {
  const paths: Record<LibraryIconName, React.ReactNode> = {
    core: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    generator: (
      <>
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />
      </>
    ),
    auth: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="1" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    organizations: (
      <>
        <circle cx="9" cy="8" r="4" />
        <circle cx="16.5" cy="9" r="3.5" />
        <path d="M2.5 21a6.5 6.5 0 0 1 13 0M13 16.5A6 6 0 0 1 21.5 21" />
      </>
    ),
    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </>
    ),
    rbac: (
      <>
        <path d="M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-4Z" />
        <circle cx="12" cy="10" r="2.5" />
        <path d="M8.5 17a3.5 3.5 0 0 1 7 0" />
      </>
    ),
    billing: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="M3 10h18M7 15h4" />
      </>
    ),
    subscriptions: (
      <>
        <path d="M18 7h4V3M6 17H2v4" />
        <path d="M20 10a8 8 0 0 0-14-5L2 9M4 14a8 8 0 0 0 14 5l4-4" />
        <path d="M14.5 9c-.5-.7-1.3-1-2.5-1-1.4 0-2.5.7-2.5 1.8 0 2.4 5 1 5 3.4 0 1.1-1.1 1.8-2.5 1.8-1.2 0-2.1-.4-2.6-1.2M12 6.5v10" />
      </>
    ),
    blocks: (
      <>
        <path d="m12 2 5 3-5 3-5-3 5-3ZM7 9l5 3 5-3M7 13l5 3 5-3M3 8l4 2.5v5L3 13V8ZM17 10.5 21 8v5l-4 2.5v-5Z" />
      </>
    ),
    docs: (
      <>
        <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v18H7.5A3.5 3.5 0 0 0 4 23.5v-18Z" />
        <path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H12v18h4.5a3.5 3.5 0 0 1 3.5 3.5v-18Z" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}
