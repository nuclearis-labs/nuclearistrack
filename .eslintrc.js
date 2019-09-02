module.exports = {
  extends: ['airbnb', 'prettier', 'plugin:node/recommended'],
  plugins: ['prettier', 'jest'],
  rules: {
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    'no-dynamic-require': 'off',
    'global-require': 'off'
  },
  env: {
    'jest/globals': true
  }
};
