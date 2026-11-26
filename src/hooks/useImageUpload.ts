// Manages one photo for the recipe form: validate, resize to WebP, preview, then upload on submit.
// State: the resized blob, its preview URL, and processing/uploading/error flags.
// An effect creates the preview object URL and revokes it on change or unmount.
import { useCallback, useEffect, useState } from 'react'
import { uploadPhoto } from '@/api/upload'
import { resizeToWebp, validateImage } from '@/lib/image'

export function useImageUpload() {
  const [blob, setBlob] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    // Object URLs are an external resource: create here, revoke in cleanup.
    // oxlint-disable-next-line react/set-state-in-effect
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [blob])

  const select = useCallback(async (file: File) => {
    const problem = validateImage(file)
    if (problem) {
      setError(problem)
      return
    }
    setError(null)
    setProcessing(true)
    try {
      setBlob(await resizeToWebp(file))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'This image could not be read.')
    } finally {
      setProcessing(false)
    }
  }, [])

  const clear = useCallback(() => {
    setBlob(null)
    setError(null)
  }, [])

  // Uploads the selected photo; returns its public URL, or null when nothing new was picked.
  const upload = useCallback(async (): Promise<string | null> => {
    if (!blob) return null
    setUploading(true)
    setError(null)
    try {
      return await uploadPhoto(blob)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'The photo could not be uploaded.'
      setError(message)
      throw new Error(message)
    } finally {
      setUploading(false)
    }
  }, [blob])

  return { hasNewPhoto: blob !== null, previewUrl: blob ? previewUrl : null, error, processing, uploading, select, clear, upload }
}
