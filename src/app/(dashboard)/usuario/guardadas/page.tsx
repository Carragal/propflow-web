'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Maximize2, BedDouble, Bath, Trash2, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants'

interface FavoriteProperty {
  id: string
  title: string
  type: string
  operation: string
  price: number
  currency: 'USD' | 'ARS'
  neighborhood: string
  city: string
  surface: number
  rooms: number
  bathrooms: number
  images: string[]
}

interface Favorite {
  id: string
  propertyId: string
  property: FavoriteProperty
}

export default function GuardadasPage() {
  const queryClient = useQueryClient()

  const { data: favorites = [], isLoading } = useQuery<Favorite[]>({
    queryKey: ['favorites'],
    queryFn: () => api.get<Favorite[]>('/favorites'),
    staleTime: 1000 * 30,
  })

  const remove = useMutation({
    mutationFn: (propertyId: string) => api.post(`/favorites/${propertyId}`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
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
          Propiedades guardadas
        </h1>
        <p className="text-gray-500 text-sm mt-1">{favorites.length} propiedades en tu lista</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Heart size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 font-medium">No tenés propiedades guardadas</p>
          <Link href="/propiedades" className="mt-4 inline-block text-sm font-semibold hover:underline" style={{ color: '#1A6B5A' }}>
            Explorar propiedades →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {favorites.map(({ id, propertyId, property: p }) => (
            <div key={id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:border-gray-200 hover:shadow-md transition-all">
              <div className="relative h-44 bg-gray-100">
                {p.images?.[0] ? (
                  <Image src={p.images[0]} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Sin imagen</span>
                  </div>
                )}
                <button
                  onClick={() => remove.mutate(propertyId)}
                  disabled={remove.isPending}
                  className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-all"
                  title="Quitar de guardadas"
                >
                  {remove.isPending ? <Loader2 size={14} className="animate-spin text-gray-400" /> : <Trash2 size={14} className="text-gray-500" />}
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#1A6B5A' }}>
                    {PROPERTY_TYPE_LABELS[p.type.toLowerCase()]}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {OPERATION_TYPE_LABELS[p.operation.toLowerCase()]}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">{p.title}</h3>
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                  <MapPin size={11} />
                  {[p.neighborhood, p.city].filter(Boolean).join(', ')}
                </div>
                <div className="flex items-center gap-3 text-gray-500 text-xs mb-4 pb-3 border-b border-gray-50">
                  {(p.rooms ?? 0) > 0 && <span className="flex items-center gap-1"><BedDouble size={12} />{p.rooms} amb.</span>}
                  <span className="flex items-center gap-1"><Maximize2 size={11} />{p.surface} m²</span>
                  {(p.bathrooms ?? 0) > 0 && <span className="flex items-center gap-1"><Bath size={12} />{p.bathrooms}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{formatPrice(p.price, p.currency)}</span>
                  <Link href={`/propiedades/${propertyId}`} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90" style={{ backgroundColor: '#1A6B5A' }}>
                    Ver más
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
