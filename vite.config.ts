import { defineConfig } from 'vite';

// Sito statico: index.html alla radice, asset in public/.
// base = percorso del progetto su GitHub Pages (abalsamoipad-dot.github.io/gestorecrisi-2026/).
export default defineConfig({
  base: '/gestorecrisi-2026/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
