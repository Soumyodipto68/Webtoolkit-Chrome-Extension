type ExtractedImage = {
  src: string
  alt: string
  width: number
  height: number
}

function normalizeImageUrl(url: string): string {
  try {
    const absoluteUrl = new URL(url, window.location.href)

    if (
      absoluteUrl.protocol !== 'http:' &&
      absoluteUrl.protocol !== 'https:'
    ) {
      return ''
    }

    return absoluteUrl.href
  } catch {
    return ''
  }
}

function getImageUrl(img: HTMLImageElement): string {
  const candidates = [
    img.currentSrc,
    img.src,
    img.getAttribute('data-src'),
    img.getAttribute('data-lazy-src'),
    img.getAttribute('data-original'),
    img.getAttribute('data-original-src'),
  ]

  for (const candidate of candidates) {
    if (!candidate) continue

    const url = normalizeImageUrl(candidate)

    if (url) {
      return url
    }
  }

  return ''
}
function extractImages(): ExtractedImage[] {
  const results: ExtractedImage[] = []
  const seen = new Set<string>()

  // 1. Normal <img> elements
  document.querySelectorAll('img').forEach((img) => {
    const src = getImageUrl(img)

    if (!src || seen.has(src)) return

    seen.add(src)

    results.push({
      src,
      alt: img.alt || '',
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
    })
  })

  // 2. <picture><source> images
document.querySelectorAll('picture source').forEach((source) => {
  const srcset = source.getAttribute('srcset')

  if (!srcset) return

  const urls = srcset
    .split(',')
    .map((item) => item.trim().split(/\s+/)[0])
    .filter(Boolean)

  urls.forEach((url) => {
    const absoluteUrl = normalizeImageUrl(url)

    if (!absoluteUrl || seen.has(absoluteUrl)) {
      return
    }

    seen.add(absoluteUrl)

    results.push({
      src: absoluteUrl,
      alt: '',
      width: 0,
      height: 0,
    })
  })
})

  // 3. CSS background images
  document.querySelectorAll<HTMLElement>('*').forEach((element) => {
    const backgroundImage = getComputedStyle(element).backgroundImage

    if (!backgroundImage || backgroundImage === 'none') {
      return
    }

    const matches = backgroundImage.matchAll(
      /url\(["']?(.*?)["']?\)/g,
    )

    for (const match of matches) {
      const url = normalizeImageUrl(match[1])

    if (!url || seen.has(url)) {
      continue
    }

      try {
        const absoluteUrl = new URL(
          url,
          window.location.href,
        ).href

        if (seen.has(absoluteUrl)) return

        seen.add(absoluteUrl)

        results.push({
          src: absoluteUrl,
          alt: '',
          width: element.offsetWidth,
          height: element.offsetHeight,
        })
      } catch {
        // Ignore invalid URLs
      }
    }
  })

  return results
}

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (message.type !== 'GET_IMAGES') {
      return
    }

    const images = extractImages()

    sendResponse({
      images,
    })
  },
)