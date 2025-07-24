module.exports = {
  extends: [
    "eslint:recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-explicit-any": "error",
    "prefer-const": "error",
    "no-var": "error"
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    "*.config.js",
    "*.config.ts"
  ]
}; 