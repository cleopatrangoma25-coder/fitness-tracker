module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true
  },
  globals: {
    NodeJS: "readonly"
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "prefer-const": "error",
    "no-var": "error"
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    ".turbo/",
    "coverage/",
    "*.config.js",
    "*.config.ts",
    "apps/web/.vite/",
    "apps/web/test-results/",
    "apps/web/playwright-report/"
  ]
}; 