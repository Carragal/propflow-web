import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Property, PropertyFilters } from '@/types/property'

interface ApiProperty extends Omit<Property, 'type' | 'operation'> {
  type: string
  operation: string
  status?: string
  views?: number
  featured?: boolean
}

interface PropertiesResponse {
  items: ApiProperty[]
  meta: { total: number; page: number; limit: number }
}

function normalizeProperty(p: ApiProperty): Property {
  return {
    ...p,
    type: p.type.toLowerCase() as Property['type'],
    operation: p.operation.toLowerCase() as Property['operation'],
    rooms: p.rooms ?? 0,
    bathrooms: p.bathrooms ?? 0,
    parking: p.parking ?? 0,
    neighborhood: p.neighborhood ?? '',
  }
}

function buildQueryString(filters: PropertyFilters, limit: number, offset: number): string {
  const params = new URLSearchParams()
  if (filters.operation) params.set('operation', filters.operation.toUpperCase())
  if (filters.type) params.set('type', filters.type.toUpperCase())
  if (filters.city) params.set('city', filters.city)
  if (filters.neighborhood) params.set('neighborhood', filters.neighborhood)
  if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice))
  if (filters.minRooms != null) params.set('minRooms', String(filters.minRooms))
  if (filters.currency) params.set('currency', filters.currency)
  if (filters.features?.length) {
    filters.features.forEach((f) => params.append('features', f))
  }
  if (filters.search) params.set('search', filters.search)
  params.set('limit', String(limit))
  params.set('offset', String(offset))
  return params.toString()
}

const PAGE_SIZE = 9

export function useProperties(filters: PropertyFilters = {}, offset = 0) {
  return useQuery({
    queryKey: ['properties', filters, offset],
    queryFn: async () => {
      const qs = buildQueryString(filters, PAGE_SIZE, offset)
      const res = await api.get<PropertiesResponse>(`/properties?${qs}`)
      return {
        items: res.items.map(normalizeProperty),
        meta: res.meta,
      }
    },
    staleTime: 1000 * 60 * 2,
  })
}

export { PAGE_SIZE }

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const p = await api.get<ApiProperty>(`/properties/${id}`)
      return normalizeProperty(p)
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  })
}
