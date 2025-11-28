import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'NBA UPS Manager',
        short_name: 'NBA UPS',
        description: 'Aplikasi Manajemen Statistik NBA',
        theme_color: '#0f172a', // Sesuai warna slate-950
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    // Proxy yang tadi kita buat (Opsional, simpan jika dipakai)
    proxy: {
      '/api': {
        target: 'https://api-nba-ups.vercel.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})