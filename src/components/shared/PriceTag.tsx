import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'

interface PriceTagProps {
  price: number
  currency: 'ARS' | 'USD'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function PriceTag({ price, currency, size = 'md', className }: PriceTagProps) {
  const formatted = formatPrice(price, currency)

  return (
    <span
      className={cn(
        'font-bold tracking-tight',
        size === 'sm' && 'text-base',
        size === 'md' && 'text-xl',
        size === 'lg' && 'text-3xl',
        className
      )}
    >
      {formatted}
    </span>
  )
}
