import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

const isDev = process.argv.includes('dev');

const integrations = [react()];
if (isDev) {
  const keystatic = (await import('@keystatic/astro')).default;
  integrations.push(keystatic());
}

export default defineConfig({
  integrations,
  vite: {
    plugins: [tailwindcss()],
  },
});
