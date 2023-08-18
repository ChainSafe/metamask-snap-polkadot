require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: '@chainsafe',
  rules: {
    'import/no-extraneous-dependencies': 'warn'
  }
};
