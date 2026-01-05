// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// // https://vite.dev/config/

// export default defineConfig({
//   plugins: [react(),tailwindcss(),],
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from "vite-plugin-svgr";
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),],
  server: {
    host: true,       // Listen on all addresses, including LAN
    open: true,       // Automatically open in browser
    https: false      // Set to true if you want HTTPS
  }
});
