import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projektyCollection = defineCollection({
  // glob načítanie zabezpečí, že Astro nájde index.md vo všetkých podpriečinkoch
  loader: glob({ pattern: "**/index.md", base: "./src/content/projekty" }),
  schema: z
    .object({
      title: z.string().optional().default("Bez názvu"),
      year: z.union([z.string(), z.number()]).optional().default("2026"),
      type: z.string().optional().default("Architektúra"),
      location: z.string().optional().default("SR"),
      order: z.number().optional().nullable(),
      featured: z.boolean().optional().default(true),
    })
    .passthrough(),
});

export const collections = {
  projekty: projektyCollection,
};
