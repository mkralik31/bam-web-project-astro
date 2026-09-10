import { defineCollection, z } from "astro:content";
// import { glob } from "astro/loaders";

const projekty = defineCollection({
  // loader: glob({
  //   pattern: "**/index.{md,mdx}",
  //   base: "./src/content/projekty",
  // }),
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      type: z.string(),
      coverImage: image(),
      gallery: z.array(image()).optional(),
      featured: z.boolean().default(true),
      order: z.number().default(99),
      location: z.string().optional(),
      year: z
        .string()
        .or(z.number())
        .optional()
        .transform((v) => String(v)),
    }),
});

export const collections = { projekty };
