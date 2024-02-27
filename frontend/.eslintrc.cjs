module.exports = {
  extends: ['mantine'],
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['api.ts'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
