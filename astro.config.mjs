import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://association-alphabetisation-fatima.pages.dev',
  adapter: cloudflare(),
  integrations: [react(), keystatic()],
  vite: {
    plugins: [tailwindcss()],
  },
});
