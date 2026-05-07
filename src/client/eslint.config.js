// @ts-check
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const angularPlugin = require('@angular-eslint/eslint-plugin');
const angularTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const templateParser = require('@angular-eslint/template-parser');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', '.angular/**'],
  },
  // TypeScript files
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.app.json'],
        createDefaultProgram: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': angularPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      ...angularPlugin.configs['recommended'].rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Downgrade migration-heavy Angular v19 rules to warnings for existing code
      '@angular-eslint/prefer-standalone': 'warn',
      '@angular-eslint/prefer-inject': 'warn',
    },
  },
  // HTML template files
  {
    files: ['src/**/*.html'],
    languageOptions: {
      parser: templateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    rules: {
      ...angularTemplatePlugin.configs['recommended'].rules,
      // Migration-guidance rules — warn only, do not block commits on existing code
      '@angular-eslint/template/prefer-control-flow': 'warn',
    },
  },
];
