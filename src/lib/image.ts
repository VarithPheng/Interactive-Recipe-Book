// Photo checks and resizing done in the browser before upload.
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_INPUT_BYTES = 5 * 1024 * 1024
export const MAX_UPLOAD_BYTES = 2_000_000
const MAX_SIDE = 1200

export function validateImage(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return 'Choose a JPEG, PNG or WebP image.'
  if (file.size > MAX_INPUT_BYTES) return 'Choose an image of 5 MB or less.'
  return null
}

// Scales the image so its longest side is at most 1200 px and re-encodes it as WebP.
export async function resizeToWebp(file: File, quality = 0.8): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('This browser cannot process images.')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
  // Some browsers silently fall back to PNG when they cannot encode WebP.
  if (!blob || blob.type !== 'image/webp') {
    throw new Error('This browser cannot convert photos to WebP. Try Chrome, Edge or Firefox.')
  }
  if (blob.size > MAX_UPLOAD_BYTES) throw new Error('The photo is still too large after resizing. Try another one.')
  return blob
}
