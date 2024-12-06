import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs-extra'

// Custom plugin to copy images
const copyImages = () => {
  return {
    name: 'copy-images',
    closeBundle: async () => {
      // Ensure the images directory exists in dist
      await fs.ensureDir('dist/images')
      
      // Copy the entire images directory from public to dist
      await fs.copy('public/images', 'dist/images', {
        overwrite: true,
        recursive: true
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copyImages()
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.jpeg') || assetInfo.name.endsWith('.jpg') || assetInfo.name.endsWith('.png')) {
            return 'images/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  }
})
