'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Trash2, Clock, MapPin, SlidersHorizontal, ChevronRight } from 'lucide-react'
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants'

interface SavedSearch {
  id: string
  label: string
  operation: string
  type: string
  city: string
  neighborhood?: string
  minRooms?: number
  maxPrice?: number
  currency: 'USD' | 'ARS'
  resultCount: number
  newCount: number
  createdAt: string
}

const INITIAL_SEARCHES: SavedSearch[] = [
  {
    id: '1',
    label: 'Departamentos en Palermo',
    operation: 'venta',
    type: 'departamento',
    city: 'Buenos Aires',
    neighborhood: 'Palermo',
    minRooms: 2,
    maxPrice: 150000,
    currency: 'USD',
    resultCount: 24,
    newCount: 3,
    createdAt: '2025-04-10',
  },
  {
    id: '2',
    label: 'Casas Belgrano 3+ amb',
    operation: 'venta',
    type: 'casa',
    city: 'Buenos Aires',
    neighborhood: 'Belgrano',
    minRooms: 3,
    currency: 'USD',
    resultCount: 11,
    newCount: 0,
    createdAt: '2025-03-28',
  },
  {
    id: '3',
    label: 'Alquiler Córdoba centro',
    operation: 'alquiler',
    type: 'departamento',
    city: 'Córdoba',
    currency: 'ARS',
    resultCount: 38,
    newCount: 7,
    createdAt: '2025-04-02',
  },
]

function buildSearchUrl(s: SavedSearch): string {
  const params = new URLSearchParams()
  params.set('operacion', s.operation)
  params.set('tipo', s.type)
  params.set('ciudad', s.city)
  if (s.neighborhood) params.set('barrio', s.neighborhood)
  if (s.minRooms) params.set('ambientes', String(s.minRooms))
  if (s.maxPrice) params.set('precioMax', String(s.maxPrice))
  return `/propiedades?${params.toString()}`
}

export default function BusquedasPage() {
  const [searches, setSearches] = useState<SavedSearch[]>(INITIAL_SEARCHES)

  const remove = (id: string) => setSearches((prev) => prev.filter((s) => s.id !== id))

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-1">Mi cuenta</p>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Búsquedas guardadas
        </h1>
        <p className="text-gray-500 text-sm mt-1">Retomá tus búsquedas donde las dejaste.</p>
      </div>

      {searches.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <Search size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 font-medium mb-1">No tenés búsquedas guardadas</p>
          <p className="text-gray-400 text-sm mb-5">Guardá una búsqueda desde el listado de propiedades.</p>
          <Link href="/propiedades" className="inline-block px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: '#1A6B5A' }}>
            Explorar propiedades
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {searches.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{s.label}</h3>
                    {s.newCount > 0 && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#1A6B5A' }}>
                        {s.newCount} nuevas
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin size={11} />{s.city}{s.neighborhood ? ` · ${s.neighborhood}` : ''}</span>
                    <span>{PROPERTY_TYPE_LABELS[s.type]}</span>
                    <span>{OPERATION_TYPE_LABELS[s.operation]}</span>
                    {s.minRooms && <span>{s.minRooms}+ amb.</span>}
                    {s.maxPrice && <span>Hasta {s.currency} {s.maxPrice.toLocaleString('es-AR')}</span>}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <SlidersHorizontal size={11} />
                      {s.resultCount} propiedades
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      Guardada el {new Date(s.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => remove(s.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all"
                    title="Eliminar búsqueda"
                  >
                    <Trash2 size={15} />
                  </button>
                  <Link
                    href={buildSearchUrl(s)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundColor: '#1A6B5A' }}
                  >
                    Ver resultados
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-700">¿Cómo guardar una búsqueda?</strong>{' '}
          Aplicá filtros en el{' '}
          <Link href="/propiedades" className="font-semibold hover:underline" style={{ color: '#1A6B5A' }}>listado de propiedades</Link>{' '}
          y hacé clic en el botón <em>"Guardar búsqueda"</em> para que aparezca aquí.
        </p>
      </div>
    </div>
  )
}
