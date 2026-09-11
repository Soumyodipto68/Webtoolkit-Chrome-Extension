import { useState } from 'react'
import CssList from './components/CssList'
import type { CssScanResult } from '../../content/cssUtils'

type CssToolsProps = {
  onBack: () => void
}

const EMPTY_RESULT: CssScanResult = {
  classes: [],
  ids: [],
}

export default function CssTools({
  onBack,
}: CssToolsProps) {
  const [result, setResult] = useState<CssScanResult>(
    EMPTY_RESULT
  )

  const [search, setSearch] = useState('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')

  const scanPage = async () => {
    setScanning(true)
    setError('')

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (!tab.id) {
        throw new Error('No active tab found.')
      }

      const response = await chrome.tabs.sendMessage(
        tab.id,
        {
          type: 'SCAN_CSS',
        }
      )

      if (!response?.success) {
        throw new Error(
          response?.error ?? 'Unable to scan this page.'
        )
      }

      setResult(response.data)
    } catch {
      setError(
        'Unable to scan this page. Try refreshing the webpage and scan again.'
      )
    } finally {
      setScanning(false)
    }
  }

  const copyAll = async () => {
    const classes = result.classes
      .map((item) => `.${item.name}`)
      .join('\n')

    const ids = result.ids
      .map((item) => `#${item.name}`)
      .join('\n')

    const output = [
      classes ? 'CLASSES\n' + classes : '',
      ids ? 'IDS\n' + ids : '',
    ]
      .filter(Boolean)
      .join('\n\n')

    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
    } catch {
      // Clipboard can fail on restricted pages.
    }
  }

  const totalClasses = result.classes.length
  const totalIds = result.ids.length

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

          <div className="min-w-0">
            <h1 className="text-sm font-semibold">
              CSS Extractor
            </h1>

            <p className="text-[11px] text-zinc-500">
              Extract classes and IDs from the page
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col gap-4 overflow-hidden p-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
            <p className="text-[10px] uppercase tracking-wide text-zinc-600">
              Classes
            </p>

            <p className="mt-1 text-lg font-semibold text-zinc-200">
              {totalClasses}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
            <p className="text-[10px] uppercase tracking-wide text-zinc-600">
              IDs
            </p>

            <p className="mt-1 text-lg font-semibold text-zinc-200">
              {totalIds}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={scanPage}
            disabled={scanning}
            className="flex-1 rounded-lg bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {scanning ? 'Scanning...' : 'Scan Page'}
          </button>

          <button
            onClick={copyAll}
            disabled={!totalClasses && !totalIds}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Copy All
          </button>
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search classes or IDs..."
          className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 outline-none placeholder:text-zinc-700 focus:border-zinc-600"
        />

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
            <p className="text-[10px] leading-4 text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Lists */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          <CssList
            title="Classes"
            items={result.classes}
            prefix="."
            search={search}
          />

          <CssList
            title="IDs"
            items={result.ids}
            prefix="#"
            search={search}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-5 py-3 text-center">
        <span className="text-[10px] text-zinc-600">
          WebToolKit CSS Extractor
        </span>
      </footer>
    </div>
  )
}