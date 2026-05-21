'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ARGENTINIAN_CITIES, OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants'
import type { OperationType, PropertyType } from '@/types/property'

const OPERATION_OPTIONS: OperationType[] = ['venta', 'alquiler', 'emprendimiento']
const PROPERTY_TYPE_OPTIONS: PropertyType[] = ['departamento', 'casa', 'terreno', 'local', 'oficina']

interface SearchBarProps {
  compact?: boolean
  className?: string
}

export default function SearchBar({ compact = false, className }: SearchBarProps) {
  const router = useRouter()
  const [operation, setOperation] = useState<OperationType>('venta')
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('')
  const [location, setLocation] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleLocationChange = (value: string) => {
    setLocation(value)
    if (value.length > 1) {
      const matches = ARGENTINIAN_CITIES.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      )
      setLocationSuggestions(matches)
      setShowSuggestions(matches.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.set('operacion', operation)
    if (propertyType) params.set('tipo', propertyType)
    if (location) params.set('ciudad', location)
    router.push(`/propiedades?${params.toString()}`)
  }

  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-2xl border border-gray-100',
        compact ? 'p-2' : 'p-3',
        className
      )}
    >
      {/* Operation tabs */}
      {!compact && (
        <div className="flex gap-1 mb-3 px-1">
          {OPERATION_OPTIONS.map((op) => (
            <button
              key={op}
              onClick={() => setOperation(op)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                operation === op
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
              style={
                operation === op ? { backgroundColor: '#1A6B5A' } : undefined
              }
            >
              {OPERATION_TYPE_LABELS[op]}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        {/* Location input */}
        <div className="relative flex-1">
          <MapPin
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Ciudad, barrio o dirección"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onFocus={() => location.length > 1 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            style={
              undefined
            }
          />
          {showSuggestions && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
              {locationSuggestions.map((city) => (
                <li key={city}>
                  <button
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    onMouseDown={() => {
                      setLocation(city)
                      setShowSuggestions(false)
                    }}
                  >
                    <MapPin size={13} className="text-gray-400" />
                    {city}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Property type */}
        <div className="relative sm:w-44">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as PropertyType | '')}
            className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all pr-8"
          >
            <option value="">Tipo de propiedad</option>
            {PROPERTY_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {PROPERTY_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95 shadow-sm hover:shadow-md whitespace-nowrap"
          style={{ backgroundColor: '#1A6B5A' }}
        >
          <Search size={16} />
          Buscar
        </button>
      </div>
    </div>
  )
}
