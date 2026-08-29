/**
 * Loaded Vibes architecture helper.
 * Import/merge this fragment into the Arrangement's existing ESLint flat config;
 * do not replace framework/generated config blindly.
 */
export default [
  {
    files: ['components/blocks/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@/lib/**', '@/features/**', '@/prisma/**'], message: 'PureUI Blocks must remain presentation-only.' },
        ],
      }],
    },
  },
  {
    files: ['lib/fetchers/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@/lib/actions/**'], message: 'Fetchers are read-only and must not depend on mutation boundaries.' },
        ],
      }],
    },
  },
  {
    files: ['lib/db/transactions/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@/lib/integrations/**'], message: 'Database transactions must not perform provider/network work.' },
        ],
      }],
    },
  },
];
