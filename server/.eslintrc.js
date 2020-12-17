module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-underscore-dangle": [0, {}],
    "max-classes-per-file": [0, null],
    "no-console": [1, { allow: ["info", "warn", "error"] }],
    "import/no-extraneous-dependencies": [1, { devDependencies: true }],
  },
};
