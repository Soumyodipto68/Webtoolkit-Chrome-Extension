type ExtractedImage = {
  src: string
  alt: string
  width: number
  height: number
}

function normalizeImageUrl(url: string): string {
  try {
    const absoluteUrl = new URL(
      url,
      window.location.href,
    )

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

function getImageUrl(
  img: HTMLImageElement,
): string {
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

  // <img>
  document.querySelectorAll('img').forEach((img) => {
    const src = getImageUrl(img)

    if (!src || seen.has(src)) {
      return
    }

    seen.add(src)

    results.push({
      src,
      alt: img.alt || '',
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
    })
  })

  // <picture><source>
  document
    .querySelectorAll('picture source')
    .forEach((source) => {
      const srcset =
        source.getAttribute('srcset')

      if (!srcset) return

      const urls = srcset
        .split(',')
        .map(
          (item) =>
            item.trim().split(/\s+/)[0],
        )
        .filter(Boolean)

      urls.forEach((url) => {
        const absoluteUrl =
          normalizeImageUrl(url)

        if (
          !absoluteUrl ||
          seen.has(absoluteUrl)
        ) {
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

  // CSS background images
  document
    .querySelectorAll<HTMLElement>('*')
    .forEach((element) => {
      const backgroundImage =
        getComputedStyle(element)
          .backgroundImage

      if (
        !backgroundImage ||
        backgroundImage === 'none'
      ) {
        return
      }

      const matches =
        backgroundImage.matchAll(
          /url\(["']?(.*?)["']?\)/g,
        )

      for (const match of matches) {
        const url = normalizeImageUrl(
          match[1],
        )

        if (!url || seen.has(url)) {
          continue
        }

        seen.add(url)

        results.push({
          src: url,
          alt: '',
          width: element.offsetWidth,
          height: element.offsetHeight,
        })
      }
    })

  return results
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function scanFullPage(): Promise<ExtractedImage[]> {
  const scrollElement =
    document.scrollingElement

  if (!scrollElement) {
    return extractImages()
  }

  const originalPosition = window.scrollY

  const pageHeight =
    scrollElement.scrollHeight

  const viewportHeight =
    window.innerHeight

  const step = Math.max(
    viewportHeight * 0.8,
    300,
  )

  const positions: number[] = []

  for (
    let position = 0;
    position < pageHeight;
    position += step
  ) {
    positions.push(position)
  }

  // Always scan the very bottom
  positions.push(
    Math.max(
      0,
      pageHeight - viewportHeight,
    ),
  )

  const seen = new Set<string>()
  let allImages: ExtractedImage[] = []

  for (const position of positions) {
    window.scrollTo({
      top: position,
      behavior: 'instant',
    })

    // Give lazy-loaded images time to load
    await wait(350)

    const currentImages =
      extractImages()

    for (const image of currentImages) {
      if (seen.has(image.src)) {
        continue
      }

      seen.add(image.src)
      allImages.push(image)
    }
  }

  // Return to original position
  window.scrollTo({
    top: originalPosition,
    behavior: 'instant',
  })

  return allImages
}

// Prevent duplicate listeners if content.js
// gets injected more than once.
const globalWindow =
  window as typeof window & {
    __webtoolkitLoaded?: boolean
  }

if (!globalWindow.__webtoolkitLoaded) {
  globalWindow.__webtoolkitLoaded = true

  chrome.runtime.onMessage.addListener(
    (message, _sender, sendResponse) => {
      if (message.type === 'GET_IMAGES') {
        const images = extractImages()

        sendResponse({
          images,
        })

        return
      }

      if (message.type === 'SCAN_FULL_PAGE') {
        scanFullPage().then((images) => {
          sendResponse({
            images,
          })
        })

        return true
      }
    },
  )
}