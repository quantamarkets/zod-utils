// / <reference types="vitest" />
import { defineConfig } from 'vite';

const fileName = {
  es: 'index.mjs',
  cjs: 'index.cjs',
  iife: 'index.iife.js',
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

module.exports = defineConfig({
  base: './',
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'lib',
      formats,
      fileName: (format) => fileName[format],
    },
  },
  test: {

  }
});