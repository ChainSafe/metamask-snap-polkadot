const path = require('path');

module.exports = {
  extends: '../../.eslintrc.js',
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json'),
    tsconfigRootDir: path.join(__dirname)
  },
  rules: {
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-misused-promises': 'off'
  }
};
