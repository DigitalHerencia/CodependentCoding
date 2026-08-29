import { loadedVibesCapabilities } from '@/content/loadedvibes';

export const publicNavigation = [
  ...(loadedVibesCapabilities.marketing
    ? [
        { href: '/pricing', label: 'Pricing' },
        { href: '/faq', label: 'FAQ' },
      ]
    : []),
  { href: '/contact', label: 'Contact' },
] as const;

export const applicationNavigation = [
  { href: '/dashboard', label: 'Dashboard' },
  ...(loadedVibesCapabilities.sampleDomain
    ? [{ href: '/projects', label: 'Projects' }]
    : []),
  ...(loadedVibesCapabilities.invitations
    ? [{ href: '/team', label: 'Team' }]
    : []),
  ...(loadedVibesCapabilities.uploads
    ? [{ href: '/uploads', label: 'Media' }]
    : []),
  ...(loadedVibesCapabilities.maps ? [{ href: '/maps', label: 'Maps' }] : []),
  ...(loadedVibesCapabilities.ai ? [{ href: '/ai', label: 'AI' }] : []),
  { href: '/settings', label: 'Settings' },
] as const;
