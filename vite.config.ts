import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'api_'])
  const apiTarget = env.api_proxy_target || 'https://portal.pumangol.co.ao/api/book-store'

  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'api_'],
    server: {
      port: 4200,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
