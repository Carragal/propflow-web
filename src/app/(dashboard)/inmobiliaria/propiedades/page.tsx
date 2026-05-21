'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PlusCircle, MapPin, Eye, Pencil, Trash2, MoreHorizontal, CheckCircle2, Clock, XCircle, Search } from 'lucide-react'
import { mockProperties } from '@/lib/mockData'
import { formatPrice } from '@/lib/utils'
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants'

type ListingStatus = 'active' | 'pending' | 'paused'

interface AgencyListing {
  id: string
  title: string
  image: string
  neighborhood: string
  type: string
  operation: string
  price: number
  currency: 'USD' | 'ARS'
  views: number
  inquiries: number
  status: ListingStatus
}

const STATUS_CONFIG: Record<ListingStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  active: { label: 'Activa', color: '#1A6B5A', bg: '#edf7f5', icon: CheckCircle2 },
  pending: { label: 'Pendiente', color: '#f59e0b', bg: '#fffbeb', icon: Clock },
  paused: { label: 'Pausada', color: '#9ca3af', bg: '#f3f4f6', icon: XCircle },
}

const INITIAL_LISTINGS: AgencyListing[] = mockProperties.slice(0, 5).map((p, i) => ({
  id: p.id,
  title: p.title,
  image: p.images[0],
  neighborhood: p.neighborhood,
  type: p.type,
  operation: p.operation,
  price: p.price,
  currency: p.currency,
  views: [284, 512, 97, 341, 178][i],
  inquiries: [7, 12, 2, 9, 4][i],
  status: (['active', 'active', 'pending', 'active', 'paused'] as ListingStatus[])[i],
}))

export default function InmobiliariaPropiedadesPage() {
  const [listings, setListings] = useState<AgencyListing[]>(INITIAL_LISTINGS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<ListingStatus | 'all'>('all')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filtered = listings.filter((l) => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.neighborhood.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || l.status === filterStatus
    return matchSearch && matchStatus
  })

  const remove = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id))
    setOpenMenu(null)
  }

  const toggleStatus = (id: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: l.status === 'active' ? 'paused' : 'active' }
          : l
      )
    )
    setOpenMenu(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 mb-1">Inmobiliaria</p>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Mis propiedades
          </h1>
          <p className="text-gray-500 text-sm mt-1">{listings.length} propiedades publicadas</p>
        </div>
        <Link
          href="/inmobiliaria/publicar"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: '#1A6B5A' }}
        >
          <PlusCircle size={16} />
          Publicar
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
          {(['all', 'active', 'pending', 'paused'] as const).map((s) => (
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

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium">No se encontraron propiedades</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filtered.map((listing) => {
              const { label, color, bg, icon: StatusIcon } = STATUS_CONFIG[listing.status]
              return (
                <div key={listing.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/60 transition-colors group">
                  {/* Image */}
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image src={listing.image} alt={listing.title} fill className="object-cover" sizes="80px" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate mb-0.5">{listing.title}</p>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <MapPin size={10} />
                      {listing.neighborhood} · {PROPERTY_TYPE_LABELS[listing.type]} · {OPERATION_TYPE_LABELS[listing.operation]}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-sm font-bold text-gray-900">{formatPrice(listing.price, listing.currency)}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 flex-shrink-0 hidden lg:flex">
                    <span className="flex items-center gap-1"><Eye size={12} />{listing.views}</span>
                    <span className="flex items-center gap-1 text-amber-500"><span className="text-gray-400">consultas</span> {listing.inquiries}</span>
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ color, backgroundColor: bg }}>
                      <StatusIcon size={10} />
                      {label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setOpenMenu(openMenu === listing.id ? null : listing.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-all"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenu === listing.id && (
                      <div className="absolute right-0 top-9 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                        <Link href={`/propiedades/${listing.id}`} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <Eye size={14} /> Ver publicación
                        </Link>
                        <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                          <Pencil size={14} /> Editar
                        </button>
                        <button onClick={() => toggleStatus(listing.id)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                          <XCircle size={14} /> {listing.status === 'active' ? 'Pausar' : 'Activar'}
                        </button>
                        <button onClick={() => remove(listing.id)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left border-t border-gray-100">
                          <Trash2 size={14} /> Eliminar
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
