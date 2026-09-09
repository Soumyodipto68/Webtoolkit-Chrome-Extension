import { useState } from 'react'

import ImageHeader from './components/ImageHeader'
import ImageScanControls from './components/ImageScanControls'
import ImageList, {
  type ImageData,
} from './components/ImageList'

function ImageExtractor() {
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(false)
  const [fullScan, setFullScan] = useState(false)
  const [error, setError] = useState('')

  const sendMessage = (
    tabId: number,
    message: { type: string },
  ): Promise<ImageData[]> => {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabId,
        message,
        (response) => {
          if (chrome.runtime.lastError) {
            reject(
              new Error(
                chrome.runtime.lastError.message,
              ),
            )
            return
          }

          resolve(response?.images ?? [])
        },
      )
    })
  }

  const injectContentScript = async (
    tabId: number,
  ) => {
    try {
      await chrome.scripting.executeScript({
        target: {
          tabId,
        },
        files: ['content.js'],
      })
    } catch (error) {
      console.error(
        'Could not inject content script:',
        error,
      )

      throw new Error(
        'This page does not allow extensions to access it.',
      )
    }
  }

  const extractImages = async (
    scanFullPage = false,
  ) => {
    setLoading(true)
    setError('')

    if (scanFullPage) {
      setFullScan(true)
    }

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

      if (!tab.id) {
        throw new Error(
          'Could not access the current tab.',
        )
      }

      await injectContentScript(tab.id)

      const response = await sendMessage(
        tab.id,
        {
          type: scanFullPage
            ? 'SCAN_FULL_PAGE'
            : 'GET_IMAGES',
        },
      )

      setImages(response)
    } catch (error) {
      console.error(
        'Failed to extract images:',
        error,
      )

      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong.',
      )
    } finally {
      setLoading(false)
      setFullScan(false)
    }
  }

  const handleBack = () => {
    window.location.reload()
  }

  const handleClear = () => {
    setImages([])
  }

  return (
    <main className="flex max-h-[600px] min-h-[500px] w-[380px] flex-col bg-zinc-950 text-white">
      {/* Header */}
      <div className="p-5 pb-0">
        <ImageHeader onBack={handleBack} />

        {/* Initial Controls */}
        <ImageScanControls
          onExtract={() =>
            extractImages(false)
          }
          onFullScan={() =>
            extractImages(true)
          }
          loading={loading}
          fullScan={fullScan}
          hasImages={images.length > 0}
        />

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/30 p-3">
            <p className="text-xs text-red-400">
              ⚠️ {error}
            </p>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-24">
        {images.length > 0 ? (
          <ImageList
            images={images}
            onClear={handleClear}
          />
        ) : (
          !loading &&
          !error && (
            <div className="mt-5 rounded-xl border border-dashed border-zinc-800 p-6 text-center">
              <svg
                className="mx-auto mb-3 text-zinc-700"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                />
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="1.5"
                />
                <path d="M21 15l-5-5L5 21" />
              </svg>

              <p className="text-sm text-zinc-400">
                No images extracted yet
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Click Extract Images to scan
                this page.
              </p>
            </div>
          )
        )}
      </div>

      {/* Sticky Re-scan */}
      {images.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950/95 p-4 backdrop-blur">
          <button
            onClick={() =>
              extractImages(false)
            }
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
              <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
            </svg>

            {loading
              ? 'Scanning...'
              : 'Re-scan'}
          </button>
        </div>
      )}
    </main>
  )
}

export default ImageExtractor