import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tinaDirective from './astro-tina-directive/register';

export default defineConfig({
  site: 'https://ecolefatima.com',
  trailingSlash: 'always',
  adapter: cloudflare(),
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
      serialize(item) {
        const BASE = 'https://ecolefatima.com';
        // Exact FR→EN route equivalents (translated slugs — NOT a simple /en/ prefix)
        const FR_TO_EN = {
          '/': '/en/',
          '/contact/': '/en/contact/',
          '/faire-un-don/': '/en/donate/',
          '/notre-histoire/': '/en/our-story/',
          '/impact-et-transparence/': '/en/impact-transparency/',
          '/actualites/': '/en/news/',
          '/programmes/': '/en/programs/',
        };
        const EN_TO_FR = Object.fromEntries(
          Object.entries(FR_TO_EN).map(([fr, en]) => [en, fr])
        );

        const path = item.url.replace(BASE, '');
        const isEn = path.startsWith('/en/');

        let frPath, enPath;
        if (!isEn) {
          // FR page: look up exact or prefix match
          frPath = path;
          const exactEn = FR_TO_EN[path];
          if (exactEn) {
            enPath = exactEn;
          } else {
            const frPrefix = Object.keys(FR_TO_EN).find(
              (fr) => fr !== '/' && path.startsWith(fr)
            );
            enPath = frPrefix
              ? FR_TO_EN[frPrefix] + path.slice(frPrefix.length)
              : '/en' + path;
          }
        } else {
          // EN page: look up exact or prefix match
          enPath = path;
          const exactFr = EN_TO_FR[path];
          if (exactFr) {
            frPath = exactFr;
          } else {
            const enPrefix = Object.values(FR_TO_EN).find(
              (en) => en !== '/en/' && path.startsWith(en)
            );
            const matchedFrPrefix = enPrefix
              ? Object.keys(FR_TO_EN).find((fr) => FR_TO_EN[fr] === enPrefix)
              : null;
            frPath = matchedFrPrefix
              ? matchedFrPrefix + path.slice(enPrefix.length)
              : path.replace(/^\/en/, '') || '/';
          }
        }

        return {
          ...item,
          links: [
            { lang: 'fr', url: BASE + frPath },
            { lang: 'en', url: BASE + enPath },
            { lang: 'x-default', url: BASE + frPath },
          ],
        };
      },
    }),
    tinaDirective(),
  ],
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
