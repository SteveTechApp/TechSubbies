import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      define: {
        // The Gemini API key is intentionally NOT exposed here. It used to
        // be embedded directly into the public website bundle via
        // process.env.API_KEY / process.env.GEMINI_API_KEY, which meant
        // anyone visiting the site could read it out of the page source.
        // The key now lives only on the backend (backend/.env) and AI
        // calls are proxied through it - see services/geminiService.ts.
        'process.env.API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || 'http://localhost:4000/api'),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
