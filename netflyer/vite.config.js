import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteImageOptimizer({})],
})
