import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/B3options/',
  plugins: [react()],
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
})
