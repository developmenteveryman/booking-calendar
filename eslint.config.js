import js from '@eslint/js';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default {
  root: true,
  parser: tsParser,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Preact uses JSX too
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {},
  ignorePatterns: ['dist'],
};