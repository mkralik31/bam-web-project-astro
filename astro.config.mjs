// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

const { PUBLIC_SITE_URL } = loadEnv(
  process.env.NODE_ENV || "development",
  process.cwd(),
  "",
);

export default defineConfig({
  output: "static",
  site: PUBLIC_SITE_URL || "https://test.atelierbam.sk",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap(), react()],
});
