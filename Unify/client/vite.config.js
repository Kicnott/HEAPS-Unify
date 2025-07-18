import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8888'
    }
  }, // Makes Vite forward all requests starting with '/api' to the server
  build: {
    outDir: 'dist',
  },
  base: './',
})
