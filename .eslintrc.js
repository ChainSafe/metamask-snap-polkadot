require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: '@chainsafe/eslint-config/ts-mocha-chai',
  rules: {
    'import/no-extraneous-dependencies': 'warn'
  }
};
