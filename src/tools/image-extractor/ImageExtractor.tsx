import { useState } from 'react'

type ImageData = {
  src: string
  alt: string
  width: number
  height: number
}

function ImageExtractor() {
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const extractImages = async () => {
    setLoading(true)
    setError('')
    setImages([])

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (!tab.id) {
        setError('Could not access the current tab.')
        setLoading(false)
        return
      }

      // Make sure the content script is available
      try {
        await chrome.scripting.executeScript({
          target: {
            tabId: tab.id,
          },
          files: ['content.js'],
        })
      } catch (error) {
        console.error(
          'Could not inject content script:',
          error,
        )

        setError(
          'This page does not allow extensions to access it.',
        )

        setLoading(false)
        return
      }

      // Ask the content script to extract images
      chrome.tabs.sendMessage(
        tab.id,
        {
          type: 'GET_IMAGES',
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              chrome.runtime.lastError.message,
            )

            setError(
              'Could not communicate with the webpage.',
            )

            setLoading(false)
            return
          }

          setImages(response?.images ?? [])
          setLoading(false)
        },
      )
    } catch (error) {
      console.error(
        'Failed to extract images:',
        error,
      )

      setError('Something went wrong.')
      setLoading(false)
    }
  }

  const downloadImage = async (url: string, index: number) => {
    try {
      const urlObject = new URL(url)

      const pathname = urlObject.pathname
      const extension =
        pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i)?.[1] ||
        'jpg'

      await chrome.downloads.download({
        url,
        filename: `image-${index + 1}.${extension}`,
        saveAs: false,
      })
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  return (
    <main className="min-h-[500px] w-[380px] bg-zinc-950 p-5 text-white">
      {/* Header */}
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

      {/* Extract Button */}
      <button
        onClick={extractImages}
        disabled={loading}
        className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? '⏳ Extracting...' : '🔍 Extract Images'}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/30 p-3">
          <p className="text-xs text-red-400">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Results */}
      {images.length > 0 && (
        <section className="mt-5">
          {/* Result Count */}
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              Found {images.length} image
              {images.length !== 1 ? 's' : ''}
            </p>

            <button
              onClick={() => setImages([])}
              className="text-xs text-zinc-600 transition hover:text-zinc-300"
            >
              Clear
            </button>
          </div>

          {/* Image List */}
          <div className="space-y-3">
            {images.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
              >
                {/* Image */}
                <div className="flex h-32 items-center justify-center bg-zinc-950">
                  <img
                    src={image.src}
                    alt={image.alt || `Image ${index + 1}`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                </div>

                {/* Image Information */}
                <div className="p-3">
                  <p className="text-xs text-zinc-400">
                    {image.width > 0 && image.height > 0
                      ? `${image.width} × ${image.height}`
                      : 'Unknown dimensions'}
                  </p>

                  {image.alt && (
                    <p className="mt-1 truncate text-xs text-zinc-600">
                      {image.alt}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          image.src,
                        )
                      }
                      className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                    >
                      📋 Copy URL
                    </button>

                    <button
                      onClick={() =>
                        window.open(
                          image.src,
                          '_blank',
                        )
                      }
                      className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                    >
                      ↗ Open
                    </button>

                    <button
                      onClick={() =>
                        downloadImage(image.src, index)
                      }
                      className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                    >
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        images.length === 0 && (
          <div className="mt-5 rounded-xl border border-dashed border-zinc-800 p-6 text-center">
            <div className="mb-3 text-3xl">🖼️</div>

            <p className="text-sm text-zinc-400">
              No images extracted yet
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Click the button above to scan this page.
            </p>
          </div>
        )}

      {/* Footer */}
      <footer className="mt-6 border-t border-zinc-900 pt-4 text-center">
        <p className="text-[10px] text-zinc-700">
          WebToolKit • Image Extractor
        </p>
      </footer>
    </main>
  )
}

export default ImageExtractor