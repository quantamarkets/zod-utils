const { defineConfig } = require('vitest/config');
const tsconfig = require('./tsconfig.json');

module.exports = defineConfig({
  base: './',
  resolve: {
    alias: tsconfig.compilerOptions.paths,
  },
  test: {
    include: ['**/*.test.ts'],
    globals: true,
  },
});
