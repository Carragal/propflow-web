'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, Trash2, ToggleLeft, ToggleRight, MapPin, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

interface SavedSearch {
  id: string
  name: string
  filters: Record<string, any>
  alertActive: boolean
  createdAt: string
}

export default function AlertasPage() {
  const queryClient = useQueryClient()

  const { data: searches = [], isLoading } = useQuery<SavedSearch[]>({
    queryKey: ['saved-searches'],
    queryFn: () => api.get<SavedSearch[]>('/saved-searches'),
    staleTime: 1000 * 30,
  })

  const toggleAlert = useMutation({
    mutationFn: (id: string) => api.patch(`/saved-searches/${id}/alert`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-searches'] }),
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
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 mb-1">Mi cuenta</p>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Alertas de precio
          </h1>
          <p className="text-gray-500 text-sm mt-1">Activá alertas para recibir avisos de nuevas propiedades.</p>
        </div>
      </div>

      {searches.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Bell size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 font-medium">No tenés alertas configuradas</p>
          <p className="text-gray-400 text-sm mt-1">Guardá una búsqueda y activá la alerta desde "Búsquedas guardadas".</p>
        </div>
      ) : (
        <div className="space-y-3">
          {searches.map((s) => (
            <div key={s.id} className={`bg-white rounded-2xl border p-5 transition-all ${s.alertActive ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{s.name || 'Búsqueda sin nombre'}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    {s.filters.city && <span className="flex items-center gap-1"><MapPin size={11} />{s.filters.city}</span>}
                    {s.filters.operation && <span className="capitalize">{s.filters.operation.toLowerCase()}</span>}
                    {s.filters.type && <span className="capitalize">{s.filters.type.toLowerCase()}</span>}
                    {s.filters.maxPrice && <span>Hasta {s.filters.currency ?? 'USD'} {Number(s.filters.maxPrice).toLocaleString('es-AR')}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleAlert.mutate(s.id)}
                    disabled={toggleAlert.isPending}
                    title={s.alertActive ? 'Desactivar' : 'Activar'}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {s.alertActive
                      ? <ToggleRight size={26} style={{ color: '#1A6B5A' }} />
                      : <ToggleLeft size={26} />}
                  </button>
                  <button
                    onClick={() => remove.mutate(s.id)}
                    disabled={remove.isPending}
                    className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
