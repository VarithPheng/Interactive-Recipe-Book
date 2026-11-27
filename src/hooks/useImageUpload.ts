// Manages one photo for the recipe form: validate, compress to JPEG, preview, and upload.
// The upload starts as soon as a photo is picked, so saving the form rarely has to wait for it.
// State: the resized blob, its preview URL, and processing/error flags; the in-flight upload lives in a ref.
// An effect creates the preview object URL and revokes it on change or unmount.
import { useCallback, useEffect, useRef, useState } from 'react'
import { uploadPhoto } from '@/api/upload'
import { compressImage, validateImage } from '@/lib/image'

export function useImageUpload() {
  const [blob, setBlob] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  // The upload for the current blob; replaced when a new photo is picked, cleared on remove.
  const uploadRef = useRef<Promise<string> | null>(null)

  useEffect(() => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    // Object URLs are an external resource: create here, revoke in cleanup.
    // oxlint-disable-next-line react/set-state-in-effect
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [blob])

  const startUpload = useCallback((b: Blob) => {
    const promise = uploadPhoto(b)
    uploadRef.current = promise
    // Show a failure under the picker right away; submit retries it.
    promise.catch((err: unknown) => {
      if (uploadRef.current === promise) {
        uploadRef.current = null
        setError(err instanceof Error ? err.message : 'The photo could not be uploaded.')
      }
    })
  }, [])

  const select = useCallback(
    async (file: File) => {
      const problem = validateImage(file)
      if (problem) {
        setError(problem)
        return
      }
      setError(null)
      setProcessing(true)
      try {
        const resized = await compressImage(file)
        setBlob(resized)
        startUpload(resized)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'This image could not be read.')
      } finally {
        setProcessing(false)
      }
    },
    [startUpload],
  )

  const clear = useCallback(() => {
    uploadRef.current = null
    setBlob(null)
    setError(null)
  }, [])

  // Returns the public URL of the picked photo (waiting for its upload if needed), or null if none was picked.
  const getUploadedUrl = useCallback(async (): Promise<string | null> => {
    if (!blob) return null
    if (!uploadRef.current) {
      setError(null)
      startUpload(blob) // the earlier attempt failed: try once more
    }
    return uploadRef.current
  }, [blob, startUpload])

  return {
    hasNewPhoto: blob !== null,
    previewUrl: blob ? previewUrl : null,
    error,
    processing,
    select,
    clear,
    getUploadedUrl,
  }
}
