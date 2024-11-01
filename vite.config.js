import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [react(), eslintPlugin()],
  server: {
    hmr: true, // HMR 활성화 여부
    watch: {
      usePolling: true,
    },
  },
});
