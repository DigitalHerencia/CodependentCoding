export type DoctrineHeading = { id: string; text: string; depth: number };

export type DoctrineDoc = {
  slug: string;
  group: string;
  title: string;
  html: string;
  headings: DoctrineHeading[];
  previous: DoctrineNavItem | null;
  next: DoctrineNavItem | null;
};

export type DoctrineNavItem = { slug: string; title: string };

export type DoctrineNavGroup = { title: string; items: DoctrineNavItem[] };
