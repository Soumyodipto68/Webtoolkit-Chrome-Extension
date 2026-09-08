type PasswordDisplayProps = {
  password: string
  onCopy: () => void
}

function PasswordDisplay({
  password,
  onCopy,
}: PasswordDisplayProps) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1 rounded-lg bg-zinc-950 p-3">
          <p className="break-all font-mono text-sm text-zinc-200">
            {password || 'Click generate'}
          </p>
        </div>

        <button
          onClick={onCopy}
          disabled={!password}
          className="rounded-lg bg-zinc-800 p-3 text-sm transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          title="Copy password"
        >
          📋
        </button>
      </div>
    </section>
  )
}

export default PasswordDisplay