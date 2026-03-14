import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/news' }),
  schema: z.object({
    slug: z.string(),
    date: z.string(),
    month: z.string(),
    day: z.string(),
    year: z.string(),
    category: z.enum(["Formation", "Culture", "Vie Scolaire", "Environnement"]),
    title: z.string(),
    description: z.string().optional().default(''),
    image: z.string().optional().default(''),
    imageAlt: z.string().optional().default(''),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/gallery' }),
  schema: z.object({
    src: z.string(),
    alt: z.string(),
    span: z.enum(["", "col-span-2", "row-span-2", "col-span-2 row-span-2"]).default(""),
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

const programs = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/programs' }),
  schema: z.object({
    slug: z.string(),
    level: z.string(),
    title: z.string(),
    icon: z.string(),
    ages: z.string().optional(),
    description: z.string(),
    color: z.enum(["blue", "pink"]),
    image: z.string(),
    imageAlt: z.string(),
    order: z.number(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(["Éco-responsable", "Infrastructure", "Communautaire"]),
    status: z.enum(["completed", "in-progress", "planned"]),
    description: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    completionDate: z.string().optional().default(''),
    beneficiaries: z.string().optional().default(''),
    impact: z.string().optional().default(''),
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

export const collections = { news, gallery, stats, programs, projects, tiers };
