import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/** Static build for GitHub Pages. The live app still uses vite.config.ts. */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  publicDir: "public",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "docs",
    emptyOutDir: true,
    rollupOptions: {
      input: "pages.html",
    },
  },
});
