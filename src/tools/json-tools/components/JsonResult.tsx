type JsonResultProps = {
  value: string;
  valid: boolean | null;
  error: string;
  onCopy: () => void;
};

export default function JsonResult({
  value,
  valid,
  error,
  onCopy,
}: JsonResultProps) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400">Result</span>

          {valid === true && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              Valid JSON
            </span>
          )}

          {valid === false && (
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
              Invalid JSON
            </span>
          )}
        </div>

        {valid === true && value && (
          <button
            onClick={onCopy}
            className="rounded-md px-2 py-1 text-[10px] text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
          >
            Copy
          </button>
        )}
      </div>

      {valid === false ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="mb-1 text-xs font-medium text-red-400">JSON Error</p>

          <p className="break-words font-mono text-[11px] leading-5 text-red-300/70">
            {error}
          </p>
        </div>
      ) : valid === true ? (
        <pre className="max-h-[240px] overflow-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs leading-6 text-zinc-300">
          {value}
        </pre>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-center">
          <p className="text-xs text-zinc-600">
            Format or validate your JSON to see the result
          </p>
        </div>
      )}
    </div>
  );
}
