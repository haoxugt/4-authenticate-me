import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    })

  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  build: {
    rollupOptions: {
        output: {
            entryFileNames: 'js/[name]-[hash].js',
            chunkFileNames: 'js/[name]-[hash].js',
            assetFileNames(assetInfo) {
                // console.log(assetInfo)
                if(assetInfo.name.endsWith('.css')) {
                    return 'css/[name]-[hash].css';
                }
                const imgExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico'];
                if(imgExts.some(ext => assetInfo.name.endsWith(ext))) {
                    return 'images/[name]-[hash].[ext]';
                } else {
                    return 'assets/[name].[ext]';

                }
            }
        }
    }
  }
  // To automatically open the app in the browser whenever the server starts,
  // uncomment the following lines:
  // server: {
  //   open: true
  // }
}));
