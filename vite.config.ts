import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    minify: false,
    target: 'ES2021',
    outDir: './public/assets',
    assetsDir: '',
  }
})
