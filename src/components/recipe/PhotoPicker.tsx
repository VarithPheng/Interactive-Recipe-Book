// Photo field for the recipe form: choose, preview, change or remove.
import { useRef, type ChangeEvent } from 'react'
import { ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  imageUrl: string | null
  processing: boolean
  error: string | null
  onSelect: (file: File) => void
  onRemove: () => void
}

export function PhotoPicker({ imageUrl, processing, error, onSelect, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onSelect(file)
    e.target.value = '' // allow picking the same file again
  }

  return (
    <div>
      <span id="photo-label" className="mb-1 block text-sm font-medium">
        Photo <span className="font-normal text-muted-foreground">(optional)</span>
      </span>
      <input
        ref={inputRef}
        id="photo"
        type="file"
        accept="image/*"
        className="sr-only"
        aria-labelledby="photo-label"
        aria-describedby={error ? 'photo-error' : 'photo-hint'}
        onChange={handleChange}
      />

      {imageUrl ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <img
            src={imageUrl}
            alt="Selected recipe photo"
            className="aspect-[4/3] w-full sm:max-w-xs rounded-lg bg-muted object-cover"
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" disabled={processing} onClick={() => inputRef.current?.click()}>
              Change photo
            </Button>
            <Button type="button" variant="ghost" disabled={processing} onClick={onRemove}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={processing}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[4/3] w-full sm:max-w-xs flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input text-sm text-muted-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
        >
          <ImageIcon className="size-6" aria-hidden="true" />
          {processing ? 'Preparing photo…' : 'Choose a photo'}
        </button>
      )}

      {error ? (
        <p id="photo-error" className="mt-1 text-sm text-destructive">
          {error}
        </p>
      ) : (
        <p id="photo-hint" className="mt-1 text-xs text-muted-foreground">
          Any photo up to 20 MB. It's resized and compressed before upload.
        </p>
      )}
    </div>
  )
}
