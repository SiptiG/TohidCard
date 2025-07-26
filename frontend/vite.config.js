// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // anything that starts with `/api` will be forwarded to port 3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
        // no pathRewrite needed – we keep the `/api` prefix
      }
    }
  }
});
