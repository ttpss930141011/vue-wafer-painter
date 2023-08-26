import { fileURLToPath, URL } from 'node:url'
import path from "path";

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    cssCodeSplit: true,
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "VueWaferPainter",
      fileName: (format) => `vue-wafer-painter.${format}.js`,
      formats: ["es", "cjs", "iife"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
})
