import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { resolve } from "path"

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    outDir: "dist",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "src/content/imageExtractor.ts"),
        cssExtractor: resolve(__dirname, "src/content/cssExtractor.ts"),
        cssPicker: resolve(__dirname, "src/content/cssPicker.ts"),
        background: resolve(__dirname, "src/background.ts"),
      },

      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "content") {
            return "content.js"
          }

          if (chunkInfo.name === "cssExtractor") {
            return "cssExtractor.js"
          }

          if (chunkInfo.name === "cssPicker") {
            return "cssPicker.js"
          }

          if (chunkInfo.name === "background") {
            return "background.js"
          }

          return "assets/[name].js"
        },
      },
    },
  },
})