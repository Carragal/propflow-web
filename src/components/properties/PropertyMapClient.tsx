'use client'

import dynamic from 'next/dynamic'
import type { Property } from '@/types/property'

const PropertyMap = dynamic(() => import('./PropertyMap'), { ssr: false })

interface PropertyMapClientProps {
  properties: Property[]
  selectedId?: string
  onSelect?: (id: string) => void
  className?: string
}

export default function PropertyMapClient(props: PropertyMapClientProps) {
  return <PropertyMap {...props} />
}
