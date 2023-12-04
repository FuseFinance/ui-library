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
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@tests': path.resolve(__dirname, './__tests__'),
    },
  },
  plugins: [
    splitVendorChunkPlugin(),
    react(),
    checker({
      overlay: { initialIsOpen: false },
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
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
