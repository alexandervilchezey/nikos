import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    host: true, // permite conexiones externas (no solo localhost)
    port: 5173,
    strictPort: true, // lanza error si el puerto está en uso
    cors: true, // habilita CORS
    allowedHosts: ['.ngrok-free.app'], // permite conexiones desde dominios específicos
  },
})
