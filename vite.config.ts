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

          if (chunkInfo.name === "cssPicker") {
            return "cssPicker.js"
          }

          return "assets/[name].js"
        },
      },
    },
  },
})