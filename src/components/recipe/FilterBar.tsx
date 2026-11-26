// Browse controls: title search, category, sort, Staff pick toggle and ingredient chips.
import { SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IngredientChips } from './IngredientChips'
import { SORT_OPTIONS, type IngredientChip, type SortKey } from '@/lib/filters'
import { CATEGORIES, type Category } from '@/lib/types'

type Props = {
  query: string
  onQueryChange: (q: string) => void
  category: Category | 'All'
  onCategoryChange: (c: Category | 'All') => void
  sort: SortKey
  onSortChange: (s: SortKey) => void
  featuredOnly: boolean
  onFeaturedOnlyChange: (v: boolean) => void
  ingredientOptions: string[]
  chips: IngredientChip[]
  onChipsChange: (chips: IngredientChip[]) => void
}

export function FilterBar(p: Props) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <label htmlFor="search" className="sr-only">Search recipes by title</label>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          id="search"
          type="search"
          value={p.query}
          onChange={(e) => p.onQueryChange(e.target.value)}
          placeholder="Search recipes"
          className="pl-8"
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-xs text-muted-foreground">Category</label>
          <Select value={p.category} onValueChange={(v) => p.onCategoryChange(v as Category | 'All')}>
            <SelectTrigger id="category" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="sort" className="text-xs text-muted-foreground">Sort by</label>
          <Select value={p.sort} onValueChange={(v) => p.onSortChange(v as SortKey)}>
            <SelectTrigger id="sort" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant={p.featuredOnly ? 'default' : 'outline'}
          aria-pressed={p.featuredOnly}
          onClick={() => p.onFeaturedOnlyChange(!p.featuredOnly)}
        >
          Staff picks only
        </Button>
      </div>

      <IngredientChips options={p.ingredientOptions} chips={p.chips} onChange={p.onChipsChange} />
    </div>
  )
}
