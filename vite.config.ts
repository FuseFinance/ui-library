// <reference types="vitest" />

import path from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

export default defineConfig({
  resolve: {
    alias: {
      // Note: You can make a lot of aliases in here
      // AT THE MOMENT OF ADDING A NEW ALIAS, YOU MUST ADD IT TO THE tsconfig.json AND IN THE jest.config.js SO THAT THE TESTS CAN USE THE ALIAS
      '@/': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types_fuse': path.resolve(__dirname, './src/types'),
    },
  },
  plugins: [
    splitVendorChunkPlugin(),
    react(),
    checker({
      overlay: { initialIsOpen: false },
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx,mdx}"',
        dev: {
          logLevel: ['error'],
        },
      },
    }),
    viteTsconfigPaths(),
    svgrPlugin(),
  ],
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    target: 'es6',
  },
  optimizeDeps: {
    exclude: ['@codemirror/state'],
  },
});
