import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  define: {
    'window.GA_ID': process.env.GA_ID
      ? JSON.stringify(process.env.GA_ID)
      : 'undefined',
  },
});
