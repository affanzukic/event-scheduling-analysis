import { FlatCompat } from '@eslint/eslintrc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: ['next', 'prettier'],
    }),
    {
        ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'simple-import-sort/imports': 'warn',
            'simple-import-sort/exports': 'warn',

            indent: 'error',
            '@typescript-eslint/indent': 'off',

            'no-unused-vars': 'error',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],

            'no-empty': ['error', { allowEmptyCatch: true }],
        },
    },
];

export default eslintConfig;
