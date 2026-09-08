const images = Array.from(document.images)

const imageData = images
  .map((img) => ({
    src: img.src,
    alt: img.alt,
    width: img.naturalWidth,
    height: img.naturalHeight,
  }))
  .filter((image) => image.src)

console.log('WebToolKit Images:', imageData)