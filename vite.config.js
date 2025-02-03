import { fileURLToPath, URL } from 'url'

import { splitVendorChunkPlugin } from 'vite'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), splitVendorChunkPlugin(), visualizer(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: '../public/',
    chunkSizeWarningLimit: 800
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/docs': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'ws://localhost:3000', // Replace with your WebSocket server address
        ws: true, // Enable WebSocket proxying
        changeOrigin: true, // Required for WebSocket proxying
      },
      '/status': {
        target: 'ws://localhost:3000', // Replace with your WebSocket server address
        ws: true, // Enable WebSocket proxying
        changeOrigin: true, // Required for WebSocket proxying
      }
    }
  }
})
