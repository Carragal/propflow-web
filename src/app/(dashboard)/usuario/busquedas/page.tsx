'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { Search, Trash2, Clock, MapPin, ChevronRight, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

interface SavedSearch {
  id: string
  name: string
  filters: Record<string, any>
  alertActive: boolean
  createdAt: string
}

function buildSearchUrl(filters: Record<string, any>): string {
  const params = new URLSearchParams()
  if (filters.operation) params.set('operacion', filters.operation.toLowerCase())
  if (filters.type) params.set('tipo', filters.type.toLowerCase())
  if (filters.city) params.set('ciudad', filters.city)
  if (filters.neighborhood) params.set('barrio', filters.neighborhood)
  return `/propiedades?${params.toString()}`
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return dateStr }
}

export default function BusquedasPage() {
  const queryClient = useQueryClient()

  const { data: searches = [], isLoading } = useQuery<SavedSearch[]>({
    queryKey: ['saved-searches'],
    queryFn: () => api.get<SavedSearch[]>('/saved-searches'),
    staleTime: 1000 * 30,
  })

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/saved-searches/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-searches'] }),
  })

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 size={24} className="animate-spin text-gray-300" />
      </div>
    )
  }

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
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{s.name || 'Búsqueda sin nombre'}</h3>
                    {s.alertActive && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#1A6B5A' }}>
                        Alerta activa
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    {s.filters.city && <span className="flex items-center gap-1"><MapPin size={11} />{s.filters.city}</span>}
                    {s.filters.operation && <span className="capitalize">{s.filters.operation.toLowerCase()}</span>}
                    {s.filters.type && <span className="capitalize">{s.filters.type.toLowerCase()}</span>}
                    {s.filters.minRooms && <span>{s.filters.minRooms}+ amb.</span>}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={11} />
                    Guardada el {formatDate(s.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => remove.mutate(s.id)}
                    disabled={remove.isPending}
                    className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                  <Link
                    href={buildSearchUrl(s.filters)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundColor: '#1A6B5A' }}
                  >
                    Ver resultados <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
