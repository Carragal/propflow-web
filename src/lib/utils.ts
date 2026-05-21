import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: 'ARS' | 'USD'): string {
  const formatted = price.toLocaleString('es-AR')
  return currency === 'USD' ? `USD ${formatted}` : `$ ${formatted}`
}

export function formatSurface(surface: number): string {
  return `${surface} m²`
}
