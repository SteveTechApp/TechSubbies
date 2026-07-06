import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: false,
    // The backend is a separate Node project with its own package.json,
    // dependencies and Vitest config (see backend/vitest.config.ts) - run
    // `npm test` inside backend/ for those tests.
    exclude: ['**/node_modules/**', '**/dist/**', 'backend/**'],
  },
});
