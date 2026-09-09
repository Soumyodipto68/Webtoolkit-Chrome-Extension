type ImageActionsProps = {
  src: string
  index: number
}

function ImageActions({
  src,
  index,
}: ImageActionsProps) {
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(src)
    } catch (error) {
      console.error(
        'Failed to copy URL:',
        error,
      )
    }
  }

  const openImage = () => {
    window.open(src, '_blank')
  }

  const downloadImage = async () => {
    try {
      const urlObject = new URL(src)

      const extension =
        urlObject.pathname.match(
          /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i,
        )?.[1] || 'jpg'

      await chrome.downloads.download({
        url: src,
        filename: `WebToolKit/image-${index + 1}.${extension}`,
        saveAs: false,
      })
    } catch (error) {
      console.error(
        'Download failed:',
        error,
      )
    }
  }

  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      <button
        onClick={copyUrl}
        className="rounded-lg bg-zinc-800 px-2 py-2 text-xs text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
      >
        Copy
      </button>

      <button
        onClick={openImage}
        className="rounded-lg bg-zinc-800 px-2 py-2 text-xs text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
      >
        Open
      </button>

      <button
        onClick={downloadImage}
        className="rounded-lg bg-zinc-800 px-2 py-2 text-xs text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
      >
        Download
      </button>
    </div>
  )
}

export default ImageActions