import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps every asset path relative, so the built site works from any folder or sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: true, port: 5173 },
  build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 800 },
});

