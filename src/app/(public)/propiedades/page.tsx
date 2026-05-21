import { mockProperties } from '@/lib/mockData'
import PropertyListingClient from '@/components/properties/PropertyListingClient'
import type { PropertyFilters, OperationType, PropertyType } from '@/types/property'

interface SearchParams {
  operacion?: string
  tipo?: string
  ciudad?: string
  barrio?: string
}

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const initialFilters: PropertyFilters = {
    operation: (params.operacion as OperationType) || 'venta',
    type: params.tipo as PropertyType | undefined,
    city: params.ciudad,
    neighborhood: params.barrio,
  }

  return (
    <PropertyListingClient
      allProperties={mockProperties}
      initialFilters={initialFilters}
    />
  )
}
