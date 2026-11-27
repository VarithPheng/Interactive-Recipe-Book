// Shopping list built from recipes on the Detail page. Tick items off, remove them, or copy the list.
// Removals can be undone from the toast. The summary (what's left to buy, copy text) is derived with useMemo.
import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CopyIcon, ShoppingCartIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useShoppingList, type ShoppingItem } from '@/context/ShoppingListContext'
import { formatAmount } from '@/lib/format'
import { cn } from '@/lib/utils'

// You can't buy 2.08 eggs: whole items round up; other units show the scaled amount.
const amount = (i: ShoppingItem) => formatAmount({ ...i, qty: i.unit === 'piece' ? Math.ceil(i.qty) : i.qty })

export function ShoppingListPage() {
  const { items, toggle, remove, clearChecked, clearAll, restore } = useShoppingList()
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    document.title = 'Shopping list | Recipe Book'
  }, [])

  const summary = useMemo(() => {
    const toBuy = items.filter((i) => !i.checked)
    return {
      toBuyCount: toBuy.length,
      checkedCount: items.length - toBuy.length,
      text: toBuy.map((i) => `${amount(i)} ${i.name}`).join('\n'),
    }
  }, [items])

  // Every removal keeps a copy of the list so the toast can put it back.
  function removeWithUndo(message: string, change: () => void) {
    const before = items
    change()
    headingRef.current?.focus()
    toast(message, { action: { label: 'Undo', onClick: () => restore(before) } })
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary.text)
      toast.success('List copied')
    } catch {
      toast.error('Could not copy the list. Select the items and copy them instead.')
    }
  }

  return (
    <section>
      <h1 ref={headingRef} tabIndex={-1} className="font-heading text-3xl font-semibold tracking-tight outline-none">
        Shopping list
      </h1>
      <p className="mt-2 text-muted-foreground">Saved on this device. Add ingredients from any recipe page.</p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
          <ShoppingCartIcon className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <h2 className="mt-3 font-medium">Your shopping list is empty</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Open a recipe and choose "Add to shopping list" to add its ingredients.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Browse recipes</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={copy} disabled={summary.toBuyCount === 0}>
              <CopyIcon aria-hidden="true" />
              Copy list
            </Button>
            <Button
              variant="outline"
              disabled={summary.checkedCount === 0}
              onClick={() =>
                removeWithUndo(
                  `Removed ${summary.checkedCount} ticked ${summary.checkedCount === 1 ? 'item' : 'items'}`,
                  clearChecked,
                )
              }
            >
              Remove ticked
            </Button>
            <Button variant="ghost" onClick={() => removeWithUndo('Shopping list cleared', clearAll)}>
              Clear list
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
            {summary.toBuyCount === 0
              ? 'Everything is ticked off.'
              : `${summary.toBuyCount} to buy${summary.checkedCount ? `, ${summary.checkedCount} ticked` : ''}`}
          </p>

          <ul className="mt-2 divide-y divide-border border-y border-border">
            {items.map((item) => (
              <ShoppingRow
                key={item.id}
                item={item}
                onToggle={() => toggle(item.id)}
                onRemove={() => removeWithUndo(`Removed ${item.name}`, () => remove(item.id))}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function ShoppingRow({ item, onToggle, onRemove }: { item: ShoppingItem; onToggle: () => void; onRemove: () => void }) {
  const inputId = `shop-${item.id}`
  return (
    <li className="flex items-center gap-2">
      <label htmlFor={inputId} className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 py-2.5">
        <input
          id={inputId}
          type="checkbox"
          checked={item.checked}
          onChange={onToggle}
          className="mt-1 size-4 shrink-0 accent-primary"
        />
        <span className="w-20 shrink-0 font-medium tabular-nums">{amount(item)}</span>
        <span className="min-w-0">
          <span className={cn('wrap-anywhere', item.checked && 'text-muted-foreground line-through')}>{item.name}</span>
          <span className="block text-xs wrap-anywhere text-muted-foreground">{item.recipes.join(', ')}</span>
        </span>
      </label>
      <Button variant="ghost" size="icon" aria-label={`Remove ${item.name}`} onClick={onRemove}>
        <XIcon aria-hidden="true" />
      </Button>
    </li>
  )
}
