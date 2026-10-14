import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // semua alamat /api diteruskan ke server Express
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});