export type PropertyType = 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina'
export type OperationType = 'venta' | 'alquiler' | 'emprendimiento'

export interface Property {
  id: string
  title: string
  description: string
  type: PropertyType
  operation: OperationType
  price: number
  currency: 'ARS' | 'USD'
  surface: number
  rooms: number
  bathrooms: number
  parking: number
  address: string
  neighborhood: string
  city: string
  province: string
  lat: number
  lng: number
  images: string[]
  has360Tour: boolean
  aiMatchScore?: number
  features: string[]
  agencyId: string
  agentId: string
  createdAt: string
  updatedAt: string
}

export interface PropertyFilters {
  operation?: OperationType
  type?: PropertyType
  minPrice?: number
  maxPrice?: number
  minRooms?: number
  neighborhood?: string
  city?: string
  features?: string[]
}
