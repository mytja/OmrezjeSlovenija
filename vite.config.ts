import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import replace from "@rollup/plugin-replace";
import viteCompression from 'vite-plugin-compression';

const production = 'import.meta.env.PROD';

// https://vitejs.dev/config/
export default {
  optimizeDeps: { exclude: ["svelte-navigator"] },
  plugins: [
    replace({
      isProduction: production,
    }),
    svelte({}),
    viteCompression(),
  ],
};
