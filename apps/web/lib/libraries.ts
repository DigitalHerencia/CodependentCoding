import {
  capabilityRegistry,
  type CapabilityId,
} from '@loaded-vibes/core/browser';

export const libraryCategories = [
  'Foundation',
  'Identity',
  'Data',
  'Revenue',
  'Interface',
] as const;

export type LibraryCategory = (typeof libraryCategories)[number];
export type LibraryIcon =
  | 'core'
  | 'generator'
  | 'auth'
  | 'organizations'
  | 'database'
  | 'rbac'
  | 'billing'
  | 'subscriptions'
  | 'blocks'
  | 'docs';

interface LibraryCopy {
  slug: string;
  title: string;
  category: LibraryCategory;
  description: string;
  summary: string;
  icon: LibraryIcon;
  capability?: CapabilityId;
  configurationCapability?: CapabilityId;
  primaryAction: { label: string; href: string };
  example?: string;
  highlights: readonly { title: string; description: string }[];
  related: readonly string[];
  worksWith: readonly string[];
}

export interface LibraryItem extends LibraryCopy {
  status: 'Configurable capability' | 'Fixed foundation' | 'Product surface';
}

const libraryCopy: readonly LibraryCopy[] = [
  {
    slug: 'core',
    title: 'Core',
    category: 'Foundation',
    description: 'Application grammar and production-minded primitives.',
    summary:
      'The fixed Hipster Stack foundation: server-first routes, feature orchestration, validation, authorization, and transactional boundaries.',
    icon: 'core',
    primaryAction: {
      label: 'Read the architecture',
      href: '/docs/concepts/one-template',
    },
    highlights: [
      {
        title: 'Server first',
        description: 'React Server Components and thin App Router routes.',
      },
      {
        title: 'Owned boundaries',
        description: 'Features, actions, workflows, selects, and adapters.',
      },
      {
        title: 'Production defaults',
        description: 'A coherent baseline rather than stack shopping.',
      },
    ],
    related: ['generator', 'blocks', 'database'],
    worksWith: ['docs', 'generator'],
  },
  {
    slug: 'generator',
    title: 'Generator',
    category: 'Foundation',
    description: 'Deterministic one-template project generation.',
    summary:
      'The Loaded Vibes CLI resolves one portable recipe, retains supported surfaces, applies structured transforms, and creates a user-owned repository.',
    icon: 'generator',
    primaryAction: { label: 'Open the Builder', href: '/configure' },
    example: 'pnpm dlx create-loaded-vibes@latest --config loadedvibes.json',
    highlights: [
      {
        title: 'One template',
        description: 'A single repository-owned maximal application source.',
      },
      {
        title: 'Portable recipe',
        description: 'The CLI and Builder share loadedvibes.json semantics.',
      },
      {
        title: 'Deterministic output',
        description: 'Retain, remove, transform, install, and git setup.',
      },
    ],
    related: ['core', 'blocks', 'docs'],
    worksWith: ['billing', 'organizations'],
  },
  {
    slug: 'auth',
    title: 'Auth',
    category: 'Identity',
    description: 'Clerk identity and session boundary.',
    summary:
      'Clerk supplies identity and sessions while the generated application owns user adaptation, tenant membership, roles, and capabilities.',
    icon: 'auth',
    primaryAction: { label: 'Included in every build', href: '/configure' },
    highlights: [
      {
        title: 'Clerk boundary',
        description: 'Identity and session verification are fixed foundation.',
      },
      {
        title: 'App-owned users',
        description: 'Provider identity is adapted into local product records.',
      },
      {
        title: 'Protected operations',
        description: 'Authorization remains an application decision.',
      },
    ],
    related: ['rbac', 'organizations', 'database'],
    worksWith: ['core', 'generator'],
  },
  {
    slug: 'organizations',
    title: 'Organizations',
    category: 'Identity',
    description: 'Application-owned tenants and memberships.',
    summary:
      'Organizations, memberships, and tenant context are part of the generated application rather than delegated to a hosted organization product.',
    icon: 'organizations',
    capability: 'organizations',
    primaryAction: { label: 'Included in every build', href: '/configure' },
    highlights: [
      {
        title: 'Local ownership',
        description: 'Organizations and membership data live in the app.',
      },
      {
        title: 'Tenant context',
        description: 'Requests resolve an explicit active organization.',
      },
      {
        title: 'Required foundation',
        description: 'Core marks Organizations as fixed.',
      },
    ],
    related: ['auth', 'rbac', 'database'],
    worksWith: ['billing', 'subscriptions'],
  },
  {
    slug: 'database',
    title: 'Database',
    category: 'Data',
    description: 'Neon/Postgres, Prisma, and tenant containment.',
    summary:
      'The data foundation combines Postgres persistence, Prisma access, application authorization, and RLS where the template uses it for containment.',
    icon: 'database',
    primaryAction: {
      label: 'Review generated setup',
      href: '/docs/generated-project/provider-setup',
    },
    highlights: [
      {
        title: 'Postgres',
        description:
          'Neon-oriented relational persistence is fixed foundation.',
      },
      {
        title: 'Prisma',
        description: 'Typed access and migrations follow one supported path.',
      },
      {
        title: 'Tenant containment',
        description: 'Authorization and RLS protect organization data.',
      },
    ],
    related: ['organizations', 'rbac', 'core'],
    worksWith: ['billing', 'auth'],
  },
  {
    slug: 'rbac',
    title: 'RBAC',
    category: 'Data',
    description: 'Local roles, capabilities, and authorization.',
    summary:
      'Membership roles and capabilities are enforced by the generated application and composed with tenant context at protected boundaries.',
    icon: 'rbac',
    capability: 'rbac',
    primaryAction: { label: 'Included in every build', href: '/configure' },
    highlights: [
      {
        title: 'Local policy',
        description: 'Roles and capabilities remain application-owned.',
      },
      {
        title: 'Default deny',
        description: 'Protected operations require explicit authorization.',
      },
      {
        title: 'Organization scope',
        description: 'RBAC depends on the fixed Organizations capability.',
      },
    ],
    related: ['auth', 'organizations', 'database'],
    worksWith: ['admin', 'billing'],
  },
  {
    slug: 'billing',
    title: 'Billing',
    category: 'Revenue',
    description: 'Optional subscription billing capability.',
    summary:
      'Billing is a real configurable capability. Enabling it includes Organizations through core-owned dependency resolution and retains the supported billing surface.',
    icon: 'billing',
    capability: 'billing',
    configurationCapability: 'billing',
    primaryAction: { label: 'Configure Billing', href: '/configure' },
    example: `{
  "modules": {
    "billing": true
  }
}`,
    highlights: [
      {
        title: 'Real capability',
        description: 'billing is a valid loadedvibes.json module field.',
      },
      {
        title: 'Dependency aware',
        description: 'Organizations is resolved automatically.',
      },
      {
        title: 'Provider handoff',
        description: 'Generated projects still require owner setup.',
      },
    ],
    related: ['subscriptions', 'organizations', 'database'],
    worksWith: ['generator', 'docs'],
  },
  {
    slug: 'subscriptions',
    title: 'Subscriptions',
    category: 'Revenue',
    description: 'Lifecycle supplied by the Billing capability.',
    summary:
      'Plans, recurring access, usage, and subscription lifecycle belong to Billing. Subscriptions are not a second configuration switch.',
    icon: 'subscriptions',
    configurationCapability: 'billing',
    primaryAction: { label: 'Configure Billing', href: '/configure' },
    example: `{
  "modules": {
    "billing": true
  }
}`,
    highlights: [
      {
        title: 'One model',
        description: 'No duplicate subscriptions recipe field.',
      },
      {
        title: 'Billing lifecycle',
        description: 'Recurring product access is delivered through Billing.',
      },
      {
        title: 'Shared dependencies',
        description: 'The core resolver includes Organizations.',
      },
    ],
    related: ['billing', 'organizations', 'rbac'],
    worksWith: ['generator', 'docs'],
  },
  {
    slug: 'blocks',
    title: 'Blocks',
    category: 'Interface',
    description: 'Composable presentation primitives and sections.',
    summary:
      'shadcn-compatible primitives and composed presentation follow the route → feature → presentation layering of the Loaded Vibes architecture.',
    icon: 'blocks',
    primaryAction: { label: 'Explore the Builder', href: '/configure' },
    highlights: [
      {
        title: 'Composable UI',
        description: 'Primitives stay separate from product authority.',
      },
      {
        title: 'Server-first',
        description: 'Client islands exist only where interaction needs them.',
      },
      {
        title: 'Product ready',
        description:
          'Generated surfaces are a starting point, not placeholders.',
      },
    ],
    related: ['core', 'generator', 'docs'],
    worksWith: ['auth', 'billing'],
  },
  {
    slug: 'docs',
    title: 'Docs',
    category: 'Interface',
    description: 'Canonical Loaded Vibes end-user guidance.',
    summary:
      'The repository-owned docs explain configuration, CLI operation, generated-project handoff, and provider setup without inventing product behavior.',
    icon: 'docs',
    primaryAction: { label: 'Open the Docs', href: '/docs' },
    highlights: [
      {
        title: 'Canonical source',
        description: 'One docs tree serves repository and website readers.',
      },
      {
        title: 'Truthful handoff',
        description: 'Generated output and owner setup stay distinct.',
      },
      {
        title: 'Developer focused',
        description: 'Concise guidance for building after generation.',
      },
    ],
    related: ['generator', 'core', 'blocks'],
    worksWith: ['billing', 'auth'],
  },
] as const;

function libraryStatus(item: LibraryCopy): LibraryItem['status'] {
  const capability = item.capability ?? item.configurationCapability;
  if (capability) {
    return capabilityRegistry[capability].fixed
      ? 'Fixed foundation'
      : 'Configurable capability';
  }
  return ['core', 'auth', 'database', 'blocks'].includes(item.slug)
    ? 'Fixed foundation'
    : 'Product surface';
}

export const libraries: readonly LibraryItem[] = libraryCopy.map((item) => ({
  ...item,
  status: libraryStatus(item),
}));

export function getLibrary(slug: string): LibraryItem | undefined {
  return libraries.find((item) => item.slug === slug);
}

export function getRelatedLibraries(item: LibraryItem): LibraryItem[] {
  return item.related.flatMap((slug) => {
    const related = getLibrary(slug);
    return related ? [related] : [];
  });
}

export function getWorksWithLibraries(item: LibraryItem): LibraryItem[] {
  return item.worksWith.flatMap((slug) => {
    const related = getLibrary(slug);
    return related ? [related] : [];
  });
}
