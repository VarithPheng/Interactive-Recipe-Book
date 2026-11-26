// Ingredient filter: pick from the ingredients used in recipes; each chip switches between "with" and "without".
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { IngredientChip } from '@/lib/filters'
import { cn } from '@/lib/utils'

type Props = {
  options: string[]
  chips: IngredientChip[]
  onChange: (chips: IngredientChip[]) => void
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function IngredientChips({ options, chips, onChange }: Props) {
  const remaining = options.filter((o) => !chips.some((c) => c.name === o))

  function add(name: string) {
    onChange([...chips, { name, mode: 'include' }])
  }

  function toggle(name: string) {
    onChange(chips.map((c) => (c.name === name ? { ...c, mode: c.mode === 'include' ? 'exclude' : 'include' } : c)))
  }

  function remove(name: string) {
    onChange(chips.filter((c) => c.name !== name))
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="ingredient" className="text-xs text-muted-foreground">Ingredient</label>
      {/* value stays empty so the picker resets to its placeholder after each pick */}
      <Select value="" onValueChange={add} disabled={remaining.length === 0}>
        <SelectTrigger id="ingredient" className="w-full">
          <SelectValue placeholder={remaining.length ? 'Add an ingredient' : 'All ingredients added'} />
        </SelectTrigger>
        <SelectContent className="max-h-[min(24rem,var(--radix-select-content-available-height))] w-(--radix-select-trigger-width)">
          {remaining.map((name) => (
            <SelectItem key={name} value={name}>{capitalize(name)}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {chips.length > 0 && (
        <>
          <ul className="mt-2 flex flex-wrap gap-2" aria-label="Ingredient filters">
            {chips.map((c) => {
              const include = c.mode === 'include'
              return (
                <li
                  key={c.name}
                  className={cn(
                    'inline-flex items-center rounded-full border text-sm',
                    include ? 'border-primary/40 bg-primary/10' : 'border-destructive/40 bg-destructive/10',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(c.name)}
                    className="inline-flex items-center gap-1 rounded-full py-1 pr-1 pl-2.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    aria-label={`${include ? 'With' : 'Without'} ${c.name}. Switch to ${include ? 'without' : 'with'}`}
                  >
                    {include ? <PlusIcon className="size-3.5" aria-hidden="true" /> : <MinusIcon className="size-3.5" aria-hidden="true" />}
                    <span className={cn(!include && 'line-through')}>{capitalize(c.name)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(c.name)}
                    className="rounded-full p-1.5 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                    aria-label={`Remove ${c.name} filter`}
                  >
                    <XIcon className="size-3.5" aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="text-xs text-muted-foreground">Tap a chip to switch between with and without.</p>
        </>
      )}
    </div>
  )
}
