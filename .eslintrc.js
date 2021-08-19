module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es2020: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'quote-props': ['error', 'as-needed', { 'keywords': true, 'unnecessary': false }]
  }
}
