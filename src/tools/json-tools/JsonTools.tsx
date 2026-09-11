import { useState } from "react";
import JsonEditor from "./components/JsonEditor";
import JsonActions from "./components/JsonActions";
import JsonResult from "./components/JsonResult";
import { formatJson, minifyJson, validateJson } from "../../content/jsonUtils";

type JsonToolsProps = {
  onBack: () => void;
};

const SAMPLE_JSON = `{
  "name": "John Doe",
  "age": 25,
  "role": "Developer",
  "skills": [
    "JavaScript",
    "React",
    "Node.js"
  ],
  "active": true,
  "address": {
    "city": "Kolkata",
    "country": "India"
  }
}`;

export default function JsonTools({ onBack }: JsonToolsProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [valid, setValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const clearResult = () => {
    setResult("");
    setValid(null);
    setError("");
    setCopied(false);
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setResult("");
      setValid(null);
      setError("Please enter some JSON first.");
      return;
    }

    const response = formatJson(input);

    if (response.valid) {
      setResult(response.formatted);
      setValid(true);
      setError("");
    } else {
      setResult("");
      setValid(false);
      setError(response.error);
    }

    setCopied(false);
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setResult("");
      setValid(null);
      setError("Please enter some JSON first.");
      return;
    }

    const response = minifyJson(input);

    if (response.valid) {
      setResult(response.formatted);
      setValid(true);
      setError("");
    } else {
      setResult("");
      setValid(false);
      setError(response.error);
    }

    setCopied(false);
  };

  const handleValidate = () => {
    if (!input.trim()) {
      setResult("");
      setValid(null);
      setError("Please enter some JSON first.");
      return;
    }

    const response = validateJson(input);

    if (response.valid) {
      setResult(response.formatted);
      setValid(true);
      setError("");
    } else {
      setResult("");
      setValid(false);
      setError(response.error);
    }

    setCopied(false);
  };

  const handleSample = () => {
    setInput(SAMPLE_JSON);
    setResult("");
    setValid(null);
    setError("");
    setCopied(false);
  };

  const handleClear = () => {
    setInput("");
    clearResult();
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex min-h-[600px] w-[380px] flex-col bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
            aria-label="Back"
          >
            ←
          </button>

          <div>
            <h1 className="text-sm font-semibold">JSON Formatter</h1>

            <p className="text-[11px] text-zinc-500">
              Format, validate and minify JSON
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        <JsonEditor value={input} onChange={setInput} />

        <JsonActions
          onFormat={handleFormat}
          onMinify={handleMinify}
          onValidate={handleValidate}
          onSample={handleSample}
          onClear={handleClear}
          disabled={!input.trim()}
        />

        <JsonResult
          value={result}
          valid={valid}
          error={error}
          onCopy={handleCopy}
        />

        {copied && (
          <div className="text-center text-[11px] text-emerald-400">
            Copied to clipboard
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-5 py-3 text-center">
        <span className="text-[10px] text-zinc-600">
          WebToolKit JSON Formatter
        </span>
      </footer>
    </div>
  );
}
