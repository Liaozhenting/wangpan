module.exports = {
  parser: 'babel-eslint',
  extends: [
    'standard',
    // react
    'plugin:react/recommended',
    // jsx based on react plugin
    'standard-jsx',
    // turn off all eslint format related rules
    'prettier',
    'prettier/react',
    'prettier/standard'
  ],
  plugins: ['react', 'standard', 'prettier'],
  parserOptions: {
    ecmaVersion: 2015, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
  rules: {
    // standard customized
    camelcase: 'off',
    'one-var': 'off',
    'prefer-promise-reject-errors': 'off',

    // react plugin
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-boolean-value': 'off',
    'react/no-deprecated': 1,

    // eslint:recommended
    'no-useless-escape': 1,
    'no-extend-native': 1,

    // prettier plugin
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'none',
        bracketSpacing: false,
        jsxBracketSameLine: true
      }
    ]
  }
};
