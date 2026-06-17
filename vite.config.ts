import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/espn-site': {
        target: 'https://site.api.espn.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/espn-site/, ''),
      },
      '/espn-page': {
        target: 'https://www.espn.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/espn-page/, ''),
      },
    },
  },
})
