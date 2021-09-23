module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
    'quote-props': ['error', 'as-needed', { 'keywords': true, 'unnecessary': false }]
  }
}
