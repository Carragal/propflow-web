import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIMatchBadgeProps {
  score: number
  size?: 'sm' | 'md'
  className?: string
}

function getScoreColor(score: number) {
  if (score >= 90) return { bg: 'bg-emerald-500', text: 'text-white' }
  if (score >= 75) return { bg: 'bg-brand-500', text: 'text-white' }
  if (score >= 60) return { bg: 'bg-amber-500', text: 'text-white' }
  return { bg: 'bg-gray-500', text: 'text-white' }
}

export default function AIMatchBadge({ score, size = 'sm', className }: AIMatchBadgeProps) {
  const { bg, text } = getScoreColor(score)

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold',
        bg,
        text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      <Sparkles size={size === 'sm' ? 10 : 12} />
      <span>Match {score}%</span>
    </div>
  )
}
