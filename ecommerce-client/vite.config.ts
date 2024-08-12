import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import circleDependency from 'vite-plugin-circular-dependency';

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  plugins: [
    // Automatic reload with .tsx files
    circleDependency({ outputFilePath: './circleDep' }),
    react({
      include: '**/*.tsx'
    }),
    tsconfigPaths() // dont need to specify paths in tsconfig into this, since this will read from tsconfig already
  ],
  // resolve: {
  //   alias: {
  //     src: '/src'
  //   }
  // },
  build: {
    outDir: './build'
  },
  server: {
    port: 3000
  }
});
