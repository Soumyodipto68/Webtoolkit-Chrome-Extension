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
    <main className="min-h-[500px] w-[380px] bg-zinc-950 p-5 text-white rounded-2xl shadow-xl">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">🧰 WebToolKit</h1>

          <button className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition cursor-pointer">
            ⚙️
          </button>
        </div>

        <p className="mt-1 text-sm text-zinc-500">Your browser toolbox</p>
      </header>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Tools
        </h2>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => setActiveTool("password")}
            className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 transition cursor-pointer hover:border-zinc-700 hover:bg-zinc-800 hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:border-l-4 hover:border-l-indigo-400"
          >
            <span className="mr-3 text-xl flex-shrink-0">🔐</span>
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold leading-tight">Password</h3>
              <p className="text-xs text-zinc-500 leading-snug">
                Generate strong passwords
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTool("images")}
            className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 transition cursor-pointer hover:border-zinc-700 hover:bg-zinc-800 hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:border-l-4 hover:border-l-indigo-400"
          >
            <span className="mr-3 text-xl flex-shrink-0">🖼️</span>
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold leading-tight">Images</h3>
              <p className="text-xs text-zinc-500 leading-snug">
                Extract images from pages
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTool("colors")}
            className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 transition cursor-pointer hover:border-zinc-700 hover:bg-zinc-800 hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:border-l-4 hover:border-l-indigo-400"
          >
            <span className="mr-3 text-xl flex-shrink-0">🎨</span>
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold leading-tight">Colors</h3>
              <p className="text-xs text-zinc-500 leading-snug">
                Pick and convert colors
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTool("json")}
            className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 transition cursor-pointer hover:border-zinc-700 hover:bg-zinc-800 hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:border-l-4 hover:border-l-indigo-400"
          >
            <span className="mr-3 text-xl flex-shrink-0">🧩</span>
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold leading-tight">JSON Formatter</h3>
              <p className="text-xs text-zinc-500 leading-snug">
                Format and validate JSON
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTool("css")}
            className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 transition cursor-pointer hover:border-zinc-700 hover:bg-zinc-800 hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:border-l-4 hover:border-l-indigo-400"
          >
            <span className="mr-3 text-xl flex-shrink-0">🔎</span>
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold leading-tight">CSS Extractor</h3>
              <p className="text-xs text-zinc-500 leading-snug">
                Extract classes and IDs
              </p>
            </div>
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
