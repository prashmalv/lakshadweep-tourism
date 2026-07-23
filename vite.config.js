import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server on :5173 with /api/* proxied to Express server on :3000
// Production build has no proxy — Express serves both UI and API on the same port.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
