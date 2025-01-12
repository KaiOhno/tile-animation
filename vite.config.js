import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/tile-animation/', // This is crucial for GitHub Pages
  plugins: [react()],
})