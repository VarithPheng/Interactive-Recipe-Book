// Small display helpers shared by cards and the detail page.
import type { Ingredient } from '@/lib/types'

export function roundQty(n: number): number {
  return Math.round(n * 100) / 100
}

export function formatAmount(ing: Ingredient, factor = 1): string {
  const qty = roundQty(ing.qty * factor)
  return ing.unit === 'piece' ? String(qty) : `${qty} ${ing.unit}`
}

export function formatMinutes(min: number | null): string | null {
  if (min == null) return null
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${m} min` : `${h} h`
}
