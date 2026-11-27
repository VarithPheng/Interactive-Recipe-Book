// Uploads a compressed JPEG: asks /api/upload for a presigned URL, PUTs the file to R2, returns its public URL.
type PresignResponse = { uploadUrl: string; publicUrl: string } | { error: string }

export async function uploadPhoto(blob: Blob): Promise<string> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType: 'image/jpeg', size: blob.size }),
  })
  const data = (await res.json().catch(() => ({ error: 'The upload service did not respond.' }))) as PresignResponse
  if (!res.ok || 'error' in data) {
    throw new Error('error' in data ? data.error : 'Could not start the upload.')
  }

  const put = await fetch(data.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/jpeg' },
    body: blob,
  })
  if (!put.ok) throw new Error('The photo could not be uploaded. Try again.')
  return data.publicUrl
}
