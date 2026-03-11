import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://association-alphabetisation-fatima.pages.dev',
  adapter: cloudflare(),
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
});
