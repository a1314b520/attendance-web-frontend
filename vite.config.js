import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    open: false,
    proxy: {
      // 前端 /api 请求代理到后端 Spring Boot 8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
