module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true
  },
  'extends': [
    'standard'
  ],
  'parserOptions': {
    'ecmaVersion': 12
  },
  'rules': {
    'quote-props': ['error', 'as-needed', { 'keywords': true, 'unnecessary': false }]
  }
}
