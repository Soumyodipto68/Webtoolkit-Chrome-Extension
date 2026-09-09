type ImageScanControlsProps = {
  onExtract: () => void
  onFullScan: () => void
  loading: boolean
  fullScan: boolean
  hasImages: boolean
}

function ImageScanControls({
  onExtract,
  onFullScan,
  loading,
  fullScan,
  hasImages,
}: ImageScanControlsProps) {
  if (hasImages) {
    return null
  }

  return (
    <div className="space-y-2">
      {/* Extract Images */}
      <button
        onClick={onExtract}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
          />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>

        {loading && !fullScan
          ? 'Extracting...'
          : 'Extract Images'}
      </button>

      {/* Full Page Scan */}
      <button
        onClick={onFullScan}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 3v18" />
          <path d="M8 7l4-4 4 4" />
          <path d="M8 17l4 4 4-4" />
        </svg>

        {fullScan
          ? 'Scanning Full Page...'
          : 'Scan Full Page'}
      </button>
    </div>
  )
}

export default ImageScanControls