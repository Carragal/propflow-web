import type { Property } from '@/types/property'
import PropertyCard from './PropertyCard'

interface PropertyGridProps {
  properties: Property[]
  title?: string
  subtitle?: string
}

export default function PropertyGrid({ properties, title, subtitle }: PropertyGridProps) {
  return (
    <section className="w-full">
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-gray-500 text-lg">{subtitle}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {properties.map((property, index) => (
          <PropertyCard key={property.id} property={property} index={index} />
        ))}
      </div>
    </section>
  )
}
