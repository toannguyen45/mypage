import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@pages': '/src/pages',
      '@routes': '/src/routes',
      '@constants': '/src/constants',
      '@api': '/src/apis',
      '@hooks': '/src/hooks',
      '@redux': '/src/redux',
      // Thêm các alias khác ở đây
    },
  },
})
