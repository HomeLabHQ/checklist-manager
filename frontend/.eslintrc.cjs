module.exports = {
  extends: ['mantine'],
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['api.ts'],
  rules: {
    'no-shadow': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
  },
};
