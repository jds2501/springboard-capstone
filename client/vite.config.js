import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env vars from `.env`, `.env.development`, etc.
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': env.VITE_API_BASE_URL || 'http://localhost:5000'
      }
    },
    build: {
      outDir: 'build',
      emptyOutDir: true
    }
  }
});
