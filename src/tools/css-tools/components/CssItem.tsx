import { useState } from 'react'

type CssItemProps = {
  name: string
  count: number
  prefix: '.' | '#'
}

export default function CssItem({
  name,
  count,
  prefix,
}: CssItemProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${prefix}${name}`)

      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="group flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 transition hover:border-zinc-700 hover:bg-zinc-900">
      <code className="min-w-0 flex-1 truncate text-xs text-zinc-300">
        <span className="text-zinc-600">{prefix}</span>
        {name}
      </code>

      <span className="shrink-0 rounded-md bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-500">
        {count}
      </span>

      <button
        onClick={handleCopy}
        className="shrink-0 rounded-md px-2 py-1 text-[10px] text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}