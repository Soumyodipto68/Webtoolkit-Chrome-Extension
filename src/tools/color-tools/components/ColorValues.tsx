import { useState } from 'react'
import type { RGB, HSL } from '../../../content/colorUtils'

type ColorValuesProps = {
  color: string
  rgb: RGB
  hsl: HSL
}

type ValueRowProps = {
  label: string
  value: string
}

function ValueRow({
  label,
  value,
}: ValueRowProps) {
  const [copied, setCopied] = useState(false)

  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 1200)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
      <span className="w-10 text-xs font-semibold text-zinc-500">
        {label}
      </span>

      <code className="min-w-0 flex-1 truncate text-sm text-zinc-200">
        {value}
      </code>

      <button
        onClick={copyValue}
        className="shrink-0 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition hover:bg-zinc-700 hover:text-white"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

function ColorValues({
  color,
  rgb,
  hsl,
}: ColorValuesProps) {
  return (
    <section className="space-y-2">
      <ValueRow
        label="HEX"
        value={color}
      />

      <ValueRow
        label="RGB"
        value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
      />

      <ValueRow
        label="HSL"
        value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
      />
    </section>
  )
}

export default ColorValues