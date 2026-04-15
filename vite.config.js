import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
 
  // ── Dev Server ──────────────────────────────────────
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target:       'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
 
  // ── Vitest Config ───────────────────────────────────
  test: {
    globals:     true,
    environment: 'jsdom',
    setupFiles:  './src/tests/setup.js',
    css:         true,
  },
})