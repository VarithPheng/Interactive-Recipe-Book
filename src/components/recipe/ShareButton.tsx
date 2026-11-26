// Copies the full URL of the current recipe to the clipboard.
import { LinkIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function ShareButton() {
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied')
    } catch {
      toast.error('Could not copy the link. Copy it from the address bar instead.')
    }
  }

  return (
    <Button variant="outline" onClick={copy}>
      <LinkIcon aria-hidden="true" />
      Copy link
    </Button>
  )
}
