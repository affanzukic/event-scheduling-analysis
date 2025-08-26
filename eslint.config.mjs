// .eslintrc.flat.js
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

// eslint-disable-next-line
export default [
  // extend Next + Prettier base configs via FlatCompat
  ...compat.config({ extends: ['next', 'prettier'] }),

  // Global JS rules
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    plugins: {
      'simple-import-sort': simpleImportSort
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      // stylistic
      indent: ['error', 2, { SwitchCase: 1 }],
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],

      // errors / safety
      'no-unused-vars': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  },

  // TypeScript / TSX specific rules (must provide the parser object, not a string)
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      // assign the runtime parser module (object with parse/parseForESLint)
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
        // If you want type-aware rules enable `project` (slower):
        // project: "./tsconfig.json"
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'simple-import-sort': simpleImportSort,
      react: reactPlugin
    },
    rules: {
      // prefer TS-aware no-unused-vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
      ],

      // keep core indent, turn off TS indent
      indent: ['error', 2, { SwitchCase: 1 }],
      '@typescript-eslint/indent': 'off',

      // JSX/TSX indentation
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],

      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  },

  // Extra TSX-specific tweaks
  {
    files: ['**/*.tsx'],
    rules: {
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }]
      // add more TSX-only rules here
    }
  }
];
