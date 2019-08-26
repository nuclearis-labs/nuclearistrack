module.exports = {
  extends: [
    'airbnb',
    'prettier',
    'plugin:node/recommended',
    'plugin:mocha/recommended'
  ],
  plugins: ['prettier', 'mocha', 'chai-expect'],
  rules: {
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    'no-dynamic-require': 'off',
    'global-require': 'off'
  }
};
