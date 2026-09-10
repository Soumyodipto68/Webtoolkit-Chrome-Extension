import { useState } from "react";

type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
};

function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [picking, setPicking] = useState(false);

  const [error, setError] = useState("");

  const pickFromWebsite = async () => {
    setError("");
    setPicking(true);

    try {
      if (!window.EyeDropper) {
        throw new Error("EyeDropper is not supported in this browser.");
      }

      const eyeDropper = new window.EyeDropper();

      const result = await eyeDropper.open();

      onChange(result.sRGBHex.toUpperCase());
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("EyeDropper error:", error);

      setError("Could not pick the color.");
    } finally {
      setPicking(false);
    }
  };

  return (
    <section className="mb-5">
      {/* Color Preview */}
      <div
        className="relative h-40 overflow-hidden rounded-2xl border border-zinc-800"
        style={{
          backgroundColor: color,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <button
            onClick={pickFromWebsite}
            disabled={picking}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {/* Eyedropper Icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m14.5 4.5 5 5" />
              <path d="M13 6 4.5 14.5a2.12 2.12 0 0 0 0 3l2 2a2.12 2.12 0 0 0 3 0L18 11" />
              <path d="m8 16 2 2" />
              <path d="m5 19-2 2" />
            </svg>

            {picking ? "Pick a color..." : "Pick from Screen"}
          </button>
        </div>
      </div>

      {/* HEX Input */}
      <div className="mt-3 flex items-center gap-3">
        <div
          className="h-10 w-10 shrink-0 rounded-lg border border-zinc-700"
          style={{
            backgroundColor: color,
          }}
        />

        <input
          type="text"
          value={color}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="min-w-0 flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-medium text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
          placeholder="#6366F1"
          maxLength={7}
        />
      </div>

      {/* Error */}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </section>
  );
}

export default ColorPicker;
