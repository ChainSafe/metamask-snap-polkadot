module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module' // Allows for the use of imports
    },
    plugins: ['@typescript-eslint'],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/func-call-spacing': 'error',
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        'prefer-const': 'error',
        'sort-keys': 'warn'
    }
};
