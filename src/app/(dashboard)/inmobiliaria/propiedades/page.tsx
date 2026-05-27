'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { PlusCircle, MapPin, Eye, Pencil, Trash2, MoreHorizontal, CheckCircle2, Clock, XCircle, Search, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants'

type ListingStatus = 'ACTIVE' | 'PAUSED' | 'PENDING'

const STATUS_CONFIG: Record<ListingStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  ACTIVE:  { label: 'Activa',    color: '#1A6B5A', bg: '#edf7f5', icon: CheckCircle2 },
  PENDING: { label: 'Pendiente', color: '#f59e0b', bg: '#fffbeb', icon: Clock },
  PAUSED:  { label: 'Pausada',   color: '#9ca3af', bg: '#f3f4f6', icon: XCircle },
}

export default function InmobiliariaPropiedadesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<ListingStatus | 'all'>('all')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['my-properties'],
    queryFn: () => api.get<any>('/properties?limit=50&offset=0'),
    staleTime: 1000 * 60,
  })

  const pauseMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/properties/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['my-properties'] }); setOpenMenu(null) },
  })

  const allProps: any[] = (data as any)?.items ?? []

  const filtered = allProps.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.neighborhood ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 mb-1">Inmobiliaria</p>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Mis propiedades
          </h1>
          <p className="text-gray-500 text-sm mt-1">{allProps.length} propiedades publicadas</p>
        </div>
        <Link href="/inmobiliaria/publicar" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90" style={{ backgroundColor: '#1A6B5A' }}>
          <PlusCircle size={16} /> Publicar
        </Link>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título o barrio..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'ACTIVE', 'PENDING', 'PAUSED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterStatus === s ? 'text-white border-transparent' : 'text-gray-500 border-gray-200 hover:border-gray-300'}`}
              style={filterStatus === s ? { backgroundColor: '#1A6B5A' } : undefined}
            >
              {s === 'all' ? 'Todas' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium">No se encontraron propiedades</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="divide-y divide-gray-50">
            {filtered.map((p: any, idx) => {
              const status: ListingStatus = p.status in STATUS_CONFIG ? p.status : 'ACTIVE'
              const { label, color, bg, icon: StatusIcon } = STATUS_CONFIG[status]
              const isFirst = idx === 0
              const isLast = idx === filtered.length - 1
              return (
                <div key={p.id} className={`flex items-center gap-4 p-4 hover:bg-gray-50/60 transition-colors group ${isFirst ? 'rounded-t-2xl' : ''} ${isLast ? 'rounded-b-2xl' : ''}`}>
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {p.images?.[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="80px" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate mb-0.5">{p.title}</p>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <MapPin size={10} />
                      {p.neighborhood} · {PROPERTY_TYPE_LABELS[p.type?.toLowerCase()]} · {OPERATION_TYPE_LABELS[p.operation?.toLowerCase()]}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-sm font-bold text-gray-900">{formatPrice(p.price, p.currency)}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 flex-shrink-0 hidden lg:flex">
                    <span className="flex items-center gap-1"><Eye size={12} />{p.views ?? 0}</span>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ color, backgroundColor: bg }}>
                      <StatusIcon size={10} /> {label}
                    </span>
                  </div>
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-all"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenu === p.id && (
                      <div className="absolute right-0 bottom-9 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                        <Link href={`/propiedades/${p.id}`} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <Eye size={14} /> Ver publicación
                        </Link>
                        <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                          <Pencil size={14} /> Editar
                        </button>
                        <button
                          onClick={() => pauseMutation.mutate(p.id)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left border-t border-gray-100"
                        >
                          <Trash2 size={14} /> Pausar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
