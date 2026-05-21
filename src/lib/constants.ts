import type { Tenant } from '@/types/tenant'

export const DEFAULT_TENANT: Tenant = {
  id: 'smartyprop',
  name: 'CasaAI',
  subdomain: 'app',
  logo: '/logo.svg',
  primaryColor: '#1A6B5A',
  secondaryColor: '#134d41',
}

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  terreno: 'Terreno',
  local: 'Local comercial',
  oficina: 'Oficina',
}

export const OPERATION_TYPE_LABELS: Record<string, string> = {
  venta: 'Venta',
  alquiler: 'Alquiler',
  emprendimiento: 'Emprendimiento',
}

export const ARGENTINIAN_CITIES = [
  'Buenos Aires',
  'Córdoba',
  'Rosario',
  'Mendoza',
  'Tucumán',
  'La Plata',
  'Mar del Plata',
  'Salta',
  'Santa Fe',
  'San Juan',
]

export const PROPERTY_FEATURES = [
  'pileta',
  'parrilla',
  'gimnasio',
  'seguridad 24hs',
  'cochera',
  'jardín',
  'terraza',
  'balcón',
  'lavadero',
  'bodega',
  'quincho',
  'área de juegos',
]
