// Minus/plus control for the number of servings (1 to 100).
import { MinusIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = { value: number; onChange: (n: number) => void }

const MIN = 1
const MAX = 100

export function ServingsScaler({ value, onChange }: Props) {
  const set = (n: number) => onChange(Math.min(MAX, Math.max(MIN, n)))

  return (
    <div className="inline-flex items-center gap-2">
      <span id="servings-label" className="text-sm text-muted-foreground">
        Servings
      </span>
      <div
        role="group"
        aria-labelledby="servings-label"
        className="inline-flex items-center rounded-lg border border-border"
      >
        <Button
          variant="ghost"
          size="icon"
          aria-label="Fewer servings"
          disabled={value <= MIN}
          onClick={() => set(value - 1)}
        >
          <MinusIcon />
        </Button>
        <output aria-live="polite" className="w-8 text-center text-sm font-medium tabular-nums">
          {value}
        </output>
        <Button
          variant="ghost"
          size="icon"
          aria-label="More servings"
          disabled={value >= MAX}
          onClick={() => set(value + 1)}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  )
}
