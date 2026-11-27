// Photo checks and compression done in the browser before upload.
// Every photo is scaled down and re-saved as JPEG: every browser (including iPhone Safari) can encode it,
// and re-encoding also drops the photo's metadata, such as where it was taken.
export const MAX_INPUT_BYTES = 20 * 1024 * 1024
export const MAX_UPLOAD_BYTES = 2_000_000
const MAX_SIDE = 1600

// Shown under the photo field; the form skeleton prints the same text so it wraps the same way.
export const PHOTO_HINT = "Any photo up to 20 MB. It's resized and compressed before upload."

export function validateImage(file: File): string | null {
  if (file.type && !file.type.startsWith('image/')) return 'Choose a photo file.'
  if (file.size > MAX_INPUT_BYTES) return 'Choose a photo of 20 MB or less.'
  return null
}

type Decoded = { source: CanvasImageSource; width: number; height: number; release: () => void }

async function decode(file: File): Promise<Decoded> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() }
  } catch {
    // Fallback: some browsers only decode certain formats (e.g. HEIC in Safari) through <img>.
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    try {
      await img.decode()
    } catch {
      URL.revokeObjectURL(url)
      throw new Error("This photo couldn't be read. Try a JPEG or PNG.")
    }
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, release: () => URL.revokeObjectURL(url) }
  }
}

function toJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
}

// Scales the photo so its longest side is at most 1600 px and compresses it as JPEG.
export async function compressImage(file: File): Promise<Blob> {
  const img = await decode(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    img.release()
    throw new Error('This browser cannot process photos.')
  }
  ctx.fillStyle = '#fff' // JPEG has no transparency: transparent PNG areas become white, not black
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img.source, 0, 0, canvas.width, canvas.height)
  img.release()

  // Try a lower quality if a very detailed photo is still over the limit.
  for (const quality of [0.82, 0.7, 0.55]) {
    const blob = await toJpeg(canvas, quality)
    if (!blob) break
    if (blob.size <= MAX_UPLOAD_BYTES) return blob
  }
  throw new Error('This photo could not be compressed enough. Try another one.')
}
