import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        theme_color: '#43a047',
        icons: [
          {
            src: '/public/gogrow512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/public/gogrow192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ],
        shortcuts: [
          {
            name: 'GoGrow',
            short_name: 'GoGrow',
            description: 'Gardening made easy!',
            url: '/login',
            icons: [
              { 
                src: '/public/gogrow192.png',
                sizes: '192x192', 
                type: 'image/png'
              }
            ]
          },
        ],
      }
    })
  ],
  define: {
    global: {},
  },
});
