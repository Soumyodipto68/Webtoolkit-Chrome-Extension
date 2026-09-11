import { useState } from "react";
import PasswordGenerator from "./tools/password-generator/PasswordGenerator";
import ImageExtractor from "./tools/image-extractor/ImageExtractor";
import ColorTools from "./tools/color-tools/ColorTools";
import JsonTools from "./tools/json-tools/JsonTools";
import CssTools from "./tools/css-tools/CssTools";

type Tool = "dashboard" | "password" | "images" | "colors" | "json" | "css";

function App() {
  const [activeTool, setActiveTool] = useState<Tool>("dashboard");

  if (activeTool === "password") {
    return <PasswordGenerator />;
  }

  if (activeTool === "images") {
    return <ImageExtractor />;
  }
  if (activeTool === "colors") {
    return <ColorTools onBack={() => setActiveTool("dashboard")} />;
  }

  if (activeTool === "json") {
    return <JsonTools onBack={() => setActiveTool("dashboard")} />;
  }

  if (activeTool === "css") {
    return <CssTools onBack={() => setActiveTool("dashboard")} />;
  }

  return (
    <main className="min-h-[500px] w-[380px] bg-zinc-950 p-5 text-white">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">🧰 WebToolKit</h1>

          <button className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">
            ⚙️
          </button>
        </div>

        <p className="mt-1 text-sm text-zinc-500">Your browser toolbox</p>
      </header>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Tools
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveTool("password")}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
          >
            <div className="mb-3 text-2xl">🔐</div>

            <h3 className="font-semibold">Password</h3>

            <p className="mt-1 text-xs text-zinc-500">
              Generate strong passwords
            </p>
          </button>

          <button
            onClick={() => setActiveTool("images")}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
          >
            <div className="mb-3 text-2xl">🖼️</div>

            <h3 className="font-semibold">Images</h3>

            <p className="mt-1 text-xs text-zinc-500">
              Extract images from pages
            </p>
          </button>

          <button
            onClick={() => setActiveTool("colors")}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
          >
            <div className="mb-3 text-2xl">🎨</div>

            <h3 className="font-semibold">Colors</h3>

            <p className="mt-1 text-xs text-zinc-500">
              Pick and convert colors
            </p>
          </button>

          <button
            onClick={() => setActiveTool("json")}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
          >
            <div className="mb-3 text-2xl">🧩</div>

            <h3 className="font-semibold">JSON Formatter</h3>

            <p className="mt-1 text-xs text-zinc-500">
              Format and validate JSON
            </p>
          </button>

          <button
            onClick={() => setActiveTool("css")}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
          >
            <div className="mb-3 text-2xl">🔎</div>

            <h3 className="font-semibold">CSS Extractor</h3>

            <p className="mt-1 text-xs text-zinc-500">
              Extract classes and IDs
            </p>
          </button>
        </div>
      </section>

      <footer className="mt-8 border-t border-zinc-800 pt-4 text-center">
        <p className="text-xs text-zinc-600">WebToolKit v1.0.0</p>
      </footer>
    </main>
  );
}

export default App;
