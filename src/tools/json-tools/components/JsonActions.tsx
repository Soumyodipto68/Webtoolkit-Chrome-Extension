type JsonActionsProps = {
  onFormat: () => void;
  onMinify: () => void;
  onValidate: () => void;
  onSample: () => void;
  onClear: () => void;
  disabled?: boolean;
};

export default function JsonActions({
  onFormat,
  onMinify,
  onValidate,
  onSample,
  onClear,
  disabled = false,
}: JsonActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onFormat}
        disabled={disabled}
        className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Format
      </button>

      <button
        onClick={onMinify}
        disabled={disabled}
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Minify
      </button>

      <button
        onClick={onValidate}
        disabled={disabled}
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Validate
      </button>

      <div className="flex-1" />

      <button
        onClick={onSample}
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
      >
        Sample
      </button>

      <button
        onClick={onClear}
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
      >
        Clear
      </button>
    </div>
  );
}
