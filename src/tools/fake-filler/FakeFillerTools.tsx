import { useState } from "react";
import { ArrowLeft, Check, Zap } from "lucide-react";

type FakeFillerToolsProps = {
  onBack: () => void;
};

export default function FakeFillerTools({ onBack }: FakeFillerToolsProps) {
  const [status, setStatus] = useState<
    "idle" | "filling" | "success" | "error"
  >("idle");

  const [filledCount, setFilledCount] = useState(0);

  const handleFillForm = async () => {
    setStatus("filling");
    setFilledCount(0);

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        throw new Error("No active tab found.");
      }

      const response = await chrome.tabs.sendMessage(tab.id, {
        type: "FILL_FAKE_FORM",
      });

      if (!response?.success) {
        throw new Error(response?.error || "Failed to fill the form.");
      }

      setFilledCount(response.filledCount ?? 0);
      setStatus("success");
    } catch (error) {
      console.error("Fake Filler:", error);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-[500px] w-[380px] rounded-2xl bg-zinc-950 p-5 text-white shadow-xl">
      <header className="mb-8 flex items-center gap-3">
        <button
          onClick={onBack}
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-lg font-bold">🎲 Fake Filler</h1>

          <p className="text-xs text-zinc-500">Automatically fill forms</p>
        </div>
      </header>

      <section>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="mb-5 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
              <Zap size={28} className="text-yellow-400" />
            </div>
          </div>

          <h2 className="text-center text-base font-semibold">
            Fill Current Page
          </h2>

          <p className="mt-2 text-center text-xs leading-relaxed text-zinc-500">
            Automatically detect and fill text fields, dropdowns, radio buttons
            and checkboxes.
          </p>

          <button
            onClick={handleFillForm}
            disabled={status === "filling"}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Zap size={16} />

            {status === "filling" ? "Filling..." : "Fill Form"}
          </button>
        </div>

        {status === "success" && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-green-900 bg-green-950/30 px-4 py-3">
            <Check size={18} className="text-green-400" />

            <div>
              <p className="text-sm font-medium text-green-400">
                Form filled successfully
              </p>

              <p className="text-xs text-zinc-500">
                {filledCount} field
                {filledCount !== 1 ? "s" : ""} filled
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 rounded-lg border border-red-900 bg-red-950/30 px-4 py-3">
            <p className="text-sm font-medium text-red-400">
              Could not fill the page
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Make sure the current page allows extension scripts.
            </p>
          </div>
        )}
      </section>

      <footer className="mt-8 border-t border-zinc-800 pt-4 text-center">
        <p className="text-xs text-zinc-600">WebToolKit Fake Filler</p>
      </footer>
    </main>
  );
}
