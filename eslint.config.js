import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'no-bitwise': 'off',
      'no-cond-assign': 'off',
      'no-continue': 'off',
      'no-use-before-define': 'off',
      'no-mixed-operators': 'off',
      'no-multi-assign': 'off',
      'no-new-func': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-underscore-dangle': 'off',
      curly: 'error',
    },
  },
  {
    files: ['glitcher/**/*.ts', 'glitcher/**/*.js'],
    rules: {
      'no-alert': 'off',
      'no-restricted-globals': 'off',
    },
  },
);
