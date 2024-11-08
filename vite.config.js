import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import { babel } from '@rollup/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    eslintPlugin(),
    babel({
      babelHelpers: 'bundled',
      plugins: ['babel-plugin-transform-remove-console'],
      exclude: 'node_modules/**',

      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }), // 여기까지 주석 치셈 !!
  ],
  server: {
    hmr: true,
    watch: {
      usePolling: true,
    },
    // proxy: {
    //   '/api': {
    //     target: 'https://moongchee-server-p4ag7thd6-suhjin-kangs-projects.vercel.app/api',
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //     changeOrigin: true,
    //     secure: true,
    //   },
    // },
  },
});
