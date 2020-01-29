module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: "airbnb-base",
  parserOptions: {
    sourceType: "module",
  },
  rules: {
    strict: ["error", "global"],
    "import/no-extraneous-dependencies": ["error", {
      devDependencies: true,
    }],
  },
  overrides: [
    {
      files: ["**/*.spec.js"],
      env: {
        jest: true,
        node: true,
      },
    },
  ]
};
