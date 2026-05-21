import { useQuery } from '@tanstack/react-query'
import type { Property, PropertyFilters } from '@/types/property'
import { mockProperties } from '@/lib/mockData'

async function fetchProperties(filters: PropertyFilters): Promise<Property[]> {
  // TODO: replace with real API call
  await new Promise((r) => setTimeout(r, 300))
  return mockProperties.filter((p) => {
    if (filters.operation && p.operation !== filters.operation) return false
    if (filters.type && p.type !== filters.type) return false
    if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase())) return false
    if (filters.neighborhood && !p.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())) return false
    if (filters.minPrice && p.price < filters.minPrice) return false
    if (filters.maxPrice && p.price > filters.maxPrice) return false
    if (filters.minRooms && p.rooms < filters.minRooms) return false
    return true
  })
}

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => fetchProperties(filters),
    staleTime: 1000 * 60 * 2,
  })
}
