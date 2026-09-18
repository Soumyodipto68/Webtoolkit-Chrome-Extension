import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { resolve } from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    outDir: "dist",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        content: resolve(
          import.meta.dirname,
          "src/content/imageExtractor.ts"
        ),
        cssExtractor: resolve(
          import.meta.dirname,
          "src/content/cssExtractor.ts"
        ),
        fakeFiller: resolve(
          import.meta.dirname,
          "src/content/fakeFiller.ts"
        ),
        background: resolve(
          import.meta.dirname,
          "src/background.ts"
        ),
        cssPicker: resolve(
          import.meta.dirname,
          "src/content/cssPicker.ts"
        ),
      },

      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "content") {
            return "content.js"
          }

          if (chunkInfo.name === "background") {
            return "background.js"
          }

          if (chunkInfo.name === "cssPicker") {
            return "cssPicker.js"
          }

          if (chunkInfo.name === "cssExtractor") {
            return "cssExtractor.js"
          }

          if (chunkInfo.name === "fakeFiller") {
            return "fakeFiller.js"
          }

          return "assets/[name].js"
        },
      },
    },
  },
})