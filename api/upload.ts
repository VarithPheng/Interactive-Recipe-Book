// Vercel function: returns a short-lived presigned PUT URL for one JPEG photo in R2.
// The browser uploads the file directly to R2; secrets never leave the server.
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const MAX_BYTES = 2_000_000

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = process.env

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID ?? '', secretAccessKey: R2_SECRET_ACCESS_KEY ?? '' },
})

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request): Promise<Response> {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) {
    return json({ error: 'Photo upload is not configured on the server.' }, 500)
  }

  let body: { contentType?: unknown; size?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Send JSON: { contentType, size }.' }, 400)
  }

  const { contentType, size } = body
  if (contentType !== 'image/jpeg') {
    return json({ error: 'Only image/jpeg uploads are accepted.' }, 400)
  }
  if (typeof size !== 'number' || !Number.isFinite(size) || size <= 0 || size > MAX_BYTES) {
    return json({ error: 'The photo must be 2 MB or smaller after compression.' }, 400)
  }

  const key = `recipes/${crypto.randomUUID()}.jpg`
  try {
    const uploadUrl = await getSignedUrl(
      s3,
      // Type and exact size are signed, so R2 rejects any other file sent to this URL.
      new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: 'image/jpeg', ContentLength: size }),
      { expiresIn: 60, signableHeaders: new Set(['content-type']) },
    )
    return json({ uploadUrl, publicUrl: `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}` })
  } catch {
    return json({ error: 'Could not prepare the upload. Try again.' }, 500)
  }
}
