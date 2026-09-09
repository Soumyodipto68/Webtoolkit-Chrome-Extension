import ImageActions from './ImageActions'

export type ImageData = {
  src: string
  alt: string
  width: number
  height: number
}

type ImageListProps = {
  images: ImageData[]
  onClear: () => void
}

function ImageList({
  images,
  onClear,
}: ImageListProps) {
  if (images.length === 0) {
    return null
  }

  return (
    <section className="mt-5">
      {/* Count */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">
            Total images
          </span>

          <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs font-semibold text-zinc-200">
            {images.length}
          </span>
        </div>

        <button
          onClick={onClear}
          className="text-xs text-zinc-600 transition hover:text-zinc-300"
        >
          Clear
        </button>
      </div>

      {/* Images */}
      <div className="space-y-3">
        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
          >
            {/* Preview */}
            <div className="flex h-32 items-center justify-center bg-zinc-950">
              <img
                src={image.src}
                alt={
                  image.alt ||
                  `Image ${index + 1}`
                }
                className="h-full w-full object-contain"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display =
                    'none'
                }}
              />
            </div>

            {/* Information */}
            <div className="p-3">
              <p className="text-xs text-zinc-400">
                {image.width > 0 &&
                image.height > 0
                  ? `${image.width} × ${image.height}`
                  : 'Unknown dimensions'}
              </p>

              {image.alt && (
                <p className="mt-1 truncate text-xs text-zinc-600">
                  {image.alt}
                </p>
              )}

              <ImageActions
                src={image.src}
                index={index}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ImageList