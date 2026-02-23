import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'libglitch/index.ts',
      name: 'Glitch',
      formats: ['umd'],
      fileName: () => 'libglitch.js',
    },
  },
});
