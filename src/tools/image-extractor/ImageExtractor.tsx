import { useState } from 'react'

type ImageData = {
  src: string
  alt: string
  width: number
  height: number
}

type ImageResponse = {
  images: ImageData[]
}

declare const chrome: {
  tabs: {
    query: (queryInfo: {
      active: boolean
      currentWindow: boolean
    }) => Promise<Array<{ id?: number }>>
    sendMessage: (
      tabId: number,
      message: { type: string },
      callback: (response?: ImageResponse) => void,
    ) => void
  }
  runtime: {
    lastError?: { message?: string }
  }
}

function ImageExtractor() {
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(false)

  const extractImages = async () => {
    setLoading(true)

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (!tab.id) {
        return
      }

      chrome.tabs.sendMessage(
        tab.id,
        { type: 'GET_IMAGES' },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message)
            return
          }

          setImages(response?.images ?? [])
          setLoading(false)
        },
      )
    } catch (error) {
      console.error('Failed to extract images:', error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-125 w-95 bg-zinc-950 p-5 text-white">
      <header className="mb-6 flex items-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          aria-label="Go back"
        >
          ←
        </button>

        <div>
          <h1 className="text-lg font-bold">
            🖼️ Image Extractor
          </h1>

          <p className="text-xs text-zinc-500">
            Extract images from the current page
          </p>
        </div>
      </header>

      <button
        onClick={extractImages}
        disabled={loading}
        className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Extracting...' : '🔍 Extract Images'}
      </button>

      {images.length > 0 && (
        <section className="mt-5">
          <p className="mb-3 text-xs text-zinc-500">
            Found {images.length} image
            {images.length !== 1 ? 's' : ''}
          </p>

          <div className="space-y-3">
            {images.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-32 w-full object-cover"
                />

                <div className="p-3">
                  <p className="truncate text-xs text-zinc-400">
                    {image.width} × {image.height}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!loading && images.length === 0 && (
        <div className="mt-5 rounded-xl border border-dashed border-zinc-800 p-6 text-center">
          <p className="text-sm text-zinc-500">
            Click the button to find images on this page.
          </p>
        </div>
      )}
    </main>
  )
}

export default ImageExtractor