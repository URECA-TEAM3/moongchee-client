import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['dist'],
  },
  {
    files: ['*.js', '*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: eslintPluginReact,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
