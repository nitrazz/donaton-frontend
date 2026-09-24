/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: 'v8',
      exclude: [
        'src/components/atoms/**',
        'src/components/molecules/**',
        'src/components/templates/**',
        'src/components/**',      
        'src/components/pages/**',
        'src/types/**',
        'src/tokens/**',
        'main.tsx',
        'index.tsx',
        'vite.config.ts',
        'Rollup.config.js'
      ]
    }
     ,
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },

  server: {
    port: 5137,
    strictPort: false,
    watch: {
      ignored: ['**/vite.config.ts'] ,
      usePolling: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});