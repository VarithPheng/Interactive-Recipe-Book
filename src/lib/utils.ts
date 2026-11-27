// Joins class names (clsx) and lets later Tailwind classes override conflicting earlier ones (tailwind-merge).
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
