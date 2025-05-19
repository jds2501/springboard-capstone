import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env vars from `.env`, `.env.development`, etc.
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: env.VITE_PORT,
      proxy: {
        '/api': env.VITE_API_BASE_URL
      }
    },
    build: {
      outDir: 'build',
      emptyOutDir: true
    }
  }
});
