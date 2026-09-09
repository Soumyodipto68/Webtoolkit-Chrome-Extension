type ImageHeaderProps = {
  onBack: () => void
}

function ImageHeader({ onBack }: ImageHeaderProps) {
  return (
    <header className="mb-6 flex items-center gap-3">
      <button
        onClick={onBack}
        className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        aria-label="Go back"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div>
        <h1 className="text-lg font-bold">
          Image Extractor
        </h1>

        <p className="text-xs text-zinc-500">
          Extract images from the current page
        </p>
      </div>
    </header>
  )
}

export default ImageHeader