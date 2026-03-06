import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
            tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/auth': 'http://localhost:8000',
      '/memory/': 'http://localhost:8000',
      '/app/uploads': 'http://localhost:8000',
      '/analytics': 'http://localhost:8000',
      '/transactions': 'http://localhost:8000',
      '/categories': 'http://localhost:8000',
      '/budget/': 'http://localhost:8000',
      '/dashboard/overview': 'http://localhost:8000',
      '/calorie-tracker/': 'http://localhost:8000',
    },
  },
})
