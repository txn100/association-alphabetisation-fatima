import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/news' }),
  schema: z.object({
    date: z.string(),
    month: z.string(),
    day: z.string(),
    year: z.string(),
    category: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    imageAlt: z.string(),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/gallery' }),
  schema: z.object({
    src: z.string(),
    alt: z.string(),
    span: z.string(),
    order: z.number(),
  }),
});

const stats = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/stats' }),
  schema: z.object({
    value: z.string(),
    label: z.string(),
    order: z.number(),
  }),
});

const tiers = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/tiers' }),
  schema: z.object({
    amount: z.number(),
    label: z.string(),
    period: z.string(),
    description: z.string(),
    icon: z.string(),
    highlighted: z.boolean(),
    order: z.number(),
  }),
});

export const collections = { news, gallery, stats, tiers };
