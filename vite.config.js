import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import { babel } from '@rollup/plugin-babel'; // <--이것도

export default defineConfig({
  plugins: [
    react(),
    eslintPlugin(),
    babel({
      // 콘솔 보고 싶으면 윗줄부터

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
  },
});
