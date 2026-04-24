import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projekty = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/projekty"
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      coverImage: image(),
      location: z.string().optional(),
      year: z.string().or(z.number()).optional().transform(v => String(v)),
    }),
});

export const collections = { projekty };