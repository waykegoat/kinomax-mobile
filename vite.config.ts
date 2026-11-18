import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

function htmlDevPlugin(): Plugin {
  return {
    name: 'html-dev-plugin',
    transformIndexHtml(html, ctx) {
      if (ctx.server) {
        return html
          .replace(/<script type="module" crossorigin src="\.\/assets\/[^"]+"><\/script>/, '<script type="module" src="/src/main.tsx"></script>')
          .replace(/<link rel="stylesheet" crossorigin href="\.\/assets\/[^"]+">/, '');
      }
      return html;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [htmlDevPlugin(), react(), tailwindcss()],
  base: './',
})
