module.exports = {
  root: true,
  extends: ['airbnb-base', 'prettier'],
  plugins: ['import'],
  rules: {
    curly: 'error',
    'no-bitwise': 'off',
    'no-cond-assign': 'off',
    'no-mixed-operators': 'off',
    'no-multi-assign': 'off',
    'no-new-func': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
  },
};
