// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

import sitemap from '@astrojs/sitemap';

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

export default defineConfig({
  site: PUBLIC_SITE_URL || 'https://atelierbam.sk',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});