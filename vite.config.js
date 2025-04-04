import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  optimizeDeps: {
    exclude: ['puppeteer', 'agent-base', 'proxy-agent']
  },
  plugins: [react(),tailwindcss()],
})
