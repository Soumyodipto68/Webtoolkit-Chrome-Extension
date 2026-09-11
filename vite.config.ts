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
      },

      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "content") {
            return "content.js"
          }

          if (chunkInfo.name === "cssExtractor") {
            return "cssExtractor.js"
          }

          return "assets/[name].js"
        },
      },
    },
  },
})