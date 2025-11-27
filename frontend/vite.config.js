import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/UConnect/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  publicDir: 'public',
})
