import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tinaDirective from './astro-tina-directive/register';

export default defineConfig({
  site: 'https://association-alphabetisation-fatima.pages.dev',
  adapter: cloudflare(),
  integrations: [react(), tinaDirective()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Suppress TinaCMS unused import warnings
          if (
            warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
            warning.exporter === 'tinacms/dist/client'
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
