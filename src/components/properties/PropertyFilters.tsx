'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS, PROPERTY_FEATURES } from '@/lib/constants'
import type { PropertyFilters, OperationType, PropertyType } from '@/types/property'

interface PropertyFiltersProps {
  filters: PropertyFilters
  onChange: (filters: PropertyFilters) => void
  resultsCount: number
  className?: string
}

const OPERATION_OPTIONS: OperationType[] = ['venta', 'alquiler', 'emprendimiento']
const TYPE_OPTIONS: PropertyType[] = ['departamento', 'casa', 'terreno', 'local', 'oficina']
const ROOM_OPTIONS = [1, 2, 3, 4, 5]

const PRICE_RANGES_USD = [
  { label: 'Hasta USD 80.000', max: 80000 },
  { label: 'USD 80.000 – 150.000', min: 80000, max: 150000 },
  { label: 'USD 150.000 – 300.000', min: 150000, max: 300000 },
  { label: 'Más de USD 300.000', min: 300000 },
]

const PRICE_RANGES_ARS = [
  { label: 'Hasta $ 300.000', max: 300000 },
  { label: '$ 300.000 – 600.000', min: 300000, max: 600000 },
  { label: '$ 600.000 – 1.000.000', min: 600000, max: 1000000 },
  { label: 'Más de $ 1.000.000', min: 1000000 },
]

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-800 hover:text-gray-900"
      >
        {title}
        {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  )
}

export default function PropertyFilters({
  filters,
  onChange,
  resultsCount,
  className,
}: PropertyFiltersProps) {
  const isAlquiler = filters.operation === 'alquiler'
  const priceRanges = isAlquiler ? PRICE_RANGES_ARS : PRICE_RANGES_USD

  const set = (partial: Partial<PropertyFilters>) => onChange({ ...filters, ...partial })

  const toggleFeature = (feature: string) => {
    const current = filters.features ?? []
    const updated = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature]
    set({ features: updated })
  }

  const hasActiveFilters =
    filters.type || filters.minPrice || filters.maxPrice || filters.minRooms ||
    (filters.features && filters.features.length > 0)

  const reset = () =>
    onChange({ operation: filters.operation })

  return (
    <aside className={cn('bg-white', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-800">Filtros</span>
          {hasActiveFilters && (
            <span
              className="text-xs font-semibold text-white px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: '#1A6B5A' }}
            >
              activos
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">{resultsCount} resultados</span>
      </div>

      <div className="space-y-0">
        {/* Operación */}
        <FilterSection title="Operación">
          <div className="flex flex-wrap gap-2">
            {OPERATION_OPTIONS.map((op) => (
              <button
                key={op}
                onClick={() => set({ operation: op, minPrice: undefined, maxPrice: undefined })}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  filters.operation === op
                    ? 'text-white border-transparent'
                    : 'text-gray-600 border-gray-200 hover:border-gray-300'
                )}
                style={filters.operation === op ? { backgroundColor: '#1A6B5A', borderColor: '#1A6B5A' } : undefined}
              >
                {OPERATION_TYPE_LABELS[op]}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Tipo */}
        <FilterSection title="Tipo de propiedad">
          <div className="space-y-1.5">
            {TYPE_OPTIONS.map((type) => (
              <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.type === type}
                  onChange={() => set({ type: filters.type === type ? undefined : type })}
                  className="w-4 h-4 rounded border-gray-300 accent-brand-500"
                  style={{ accentColor: '#1A6B5A' }}
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {PROPERTY_TYPE_LABELS[type]}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Precio */}
        <FilterSection title="Rango de precio">
          <div className="space-y-1.5">
            {priceRanges.map((range) => {
              const active =
                filters.minPrice === range.min && filters.maxPrice === range.max
              return (
                <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="radio"
                    checked={active}
                    onChange={() =>
                      active
                        ? set({ minPrice: undefined, maxPrice: undefined })
                        : set({ minPrice: range.min, maxPrice: range.max })
                    }
                    className="w-4 h-4"
                    style={{ accentColor: '#1A6B5A' }}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {range.label}
                  </span>
                </label>
              )
            })}
          </div>
        </FilterSection>

        {/* Ambientes */}
        <FilterSection title="Ambientes mínimos">
          <div className="flex gap-2 flex-wrap">
            {ROOM_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => set({ minRooms: filters.minRooms === n ? undefined : n })}
                className={cn(
                  'w-10 h-10 rounded-lg text-sm font-semibold border transition-all',
                  filters.minRooms === n
                    ? 'text-white border-transparent'
                    : 'text-gray-600 border-gray-200 hover:border-gray-300 bg-white'
                )}
                style={filters.minRooms === n ? { backgroundColor: '#1A6B5A' } : undefined}
              >
                {n === 5 ? '5+' : n}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Características */}
        <FilterSection title="Características" defaultOpen={false}>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-hide">
            {PROPERTY_FEATURES.map((feature) => (
              <label key={feature} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(filters.features ?? []).includes(feature)}
                  onChange={() => toggleFeature(feature)}
                  className="w-4 h-4 rounded border-gray-300"
                  style={{ accentColor: '#1A6B5A' }}
                />
                <span className="text-sm text-gray-700 capitalize group-hover:text-gray-900">
                  {feature}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={reset}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-all"
        >
          <X size={13} />
          Limpiar filtros
        </button>
      )}
    </aside>
  )
}
