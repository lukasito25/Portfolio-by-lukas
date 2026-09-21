/**
 * ESLint, flat config.
 *
 * The previous config parsed TypeScript with ESLint's default (JavaScript)
 * parser, so every `.ts`/`.tsx` file failed with "Parsing error: Unexpected
 * token" and `npm run lint` checked nothing while looking like it did. Next's
 * own config brings the TypeScript parser and the React/hooks rules; the
 * project's own additions sit after it.
 */

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/generated/**',
      'prisma/migrations/**',
      'cloudflare-api/**',
      'doc-previews/**',
      'templates/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Warnings, not errors: lint is not a ship gate here (see CLAUDE.md), and
      // an `any` at an API boundary is a known cost, not a defect.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'prefer-const': 'warn',
      // Straight apostrophes in JSX prose are deliberate throughout the site;
      // React renders them correctly and `&apos;` would make the copy
      // unreadable in source.
      'react/no-unescaped-entities': 'off',
    },
  },
]

export default eslintConfig
