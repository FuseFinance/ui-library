// <reference types="vitest" />

import path from 'path';
import { Plugin, defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import { peerDependencies } from './package.json';
import dts from 'vite-plugin-dts';

function importCss(): Plugin {
  return {
    name: 'import-css', // name of the plugin
    generateBundle(options, bundle) {
      // Itera sobre todos los archivos del paquete
      for (const [fileName, chunkOrAsset] of Object.entries(bundle)) {
        // Verifica si el archivo es uno de los que quieres modificar
        if (fileName === 'index.cjs.js' || fileName === 'index.es.js') {
          // Check if it is a chunk (code file)
          if (chunkOrAsset.type === 'chunk') {
            // Add your extra code at the beginning or at the end
            chunkOrAsset.code += `import "./style.css";`;
          }
        }
      }
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      // Note: You can make a lot of aliases in here
      // AT THE MOMENT OF ADDING A NEW ALIAS, YOU MUST ADD IT TO THE tsconfig.json AND IN THE jest.config.js SO THAT THE TESTS CAN USE THE ALIAS
      '@/': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types_fuse': path.resolve(__dirname, './src/types'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@app_ids': path.resolve(__dirname, './src/constants/appIDS.ts'),
      '@testUtils': path.resolve(__dirname, './__test__/utils/testUtils.tsx'),
    },
  },
  plugins: [
    splitVendorChunkPlugin(),
    react(),
    checker({
      overlay: { initialIsOpen: false },
      // typescript: true,
      eslint: {
        lintCommand: 'eslint "{src,test}/**/*.ts" "{src,test}/**/!(*stories).tsx" --fix',
        dev: {
          logLevel: ['error'],
        },
      },
    }),
    viteTsconfigPaths(),
    svgrPlugin(),
    importCss(),
    dts(),
  ],
  build: {
    lib: {
      entry: './src/index.ts', // Specifies the entry point for building the library.
      name: 'vite-react-ts-button', // Sets the name of the generated library.
      fileName: (format) => `index.${format}.js`, // Generates the output file name based on the format.
      formats: ['cjs', 'es'], // Specifies the output formats (CommonJS and ES modules).
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies)], // Defines external dependencies for Rollup bundling.
    },
    sourcemap: true, // Generates source maps for debugging.
    emptyOutDir: true, // Clears the output directory before building.
  },
  optimizeDeps: {
    exclude: ['@codemirror/state'],
  },
});
