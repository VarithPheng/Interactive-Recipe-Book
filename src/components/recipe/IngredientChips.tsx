// Ingredient filter: pick from the ingredients used in recipes. Recipes must contain every picked ingredient.
import { XIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Props = {
  options: string[]
  selected: string[]
  onChange: (names: string[]) => void
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function IngredientChips({ options, selected, onChange }: Props) {
  const remaining = options.filter((o) => !selected.includes(o))

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="ingredient" className="text-xs text-muted-foreground">
        Ingredient
      </label>
      {/* value stays empty so the picker resets to its placeholder after each pick */}
      <Select value="" onValueChange={(name) => onChange([...selected, name])} disabled={remaining.length === 0}>
        <SelectTrigger id="ingredient" className="w-full">
          <SelectValue
            placeholder={options.length > 0 && remaining.length === 0 ? 'All ingredients added' : 'Add an ingredient'}
          />
        </SelectTrigger>
        <SelectContent className="max-h-[min(24rem,var(--radix-select-content-available-height))] w-(--radix-select-trigger-width)">
          {remaining.map((name) => (
            <SelectItem key={name} value={name}>
              {capitalize(name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selected.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2" aria-label="Ingredient filters">
          {selected.map((name) => (
            <li
              key={name}
              className="inline-flex max-w-full items-center rounded-full border border-primary/40 bg-primary/10 py-0.5 pl-2.5 text-sm"
            >
              <span className="min-w-0 wrap-anywhere">{capitalize(name)}</span>
              <button
                type="button"
                onClick={() => onChange(selected.filter((n) => n !== name))}
                className="ml-0.5 rounded-full p-1.5 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-label={`Remove ${name} filter`}
              >
                <XIcon className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
