import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? '/PandoraShield/' : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        // Alias to the single CJS bundle to avoid Vite traversing 1300+ individual ESM icon
        // files in lucide-react's /dist/esm/icons/ directory, which causes the build to stall.
        'lucide-react': path.resolve(__dirname, 'node_modules/lucide-react/dist/cjs/lucide-react.js'),
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    optimizeDeps: {
      include: ['lucide-react', 'onnxruntime-web'],
    },
    build: {
      // Increase chunk size warning limit (treeData.ts + WASM references are large by design)
      chunkSizeWarningLimit: 2000,
    },
  };
});

