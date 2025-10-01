const js = require('@eslint/js');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: ['dist/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
    plugins: {
      '@typescript-eslint': typescript,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        describe: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        beforeAll: 'readonly',
        it: 'readonly',
        expect: 'readonly',
      },
    },
    rules: {
      ...typescript.configs.recommended.rules,
    },
  },
];
