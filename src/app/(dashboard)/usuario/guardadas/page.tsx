'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Maximize2, BedDouble, Bath, Trash2, SlidersHorizontal } from 'lucide-react'
import { mockProperties } from '@/lib/mockData'
import { formatPrice } from '@/lib/utils'
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants'
import AIMatchBadge from '@/components/shared/AIMatchBadge'
import type { OperationType } from '@/types/property'

const INITIAL_SAVED = ['1', '3', '6']

export default function GuardadasPage() {
  const [savedIds, setSavedIds] = useState<string[]>(INITIAL_SAVED)
  const [filter, setFilter] = useState<OperationType | 'all'>('all')

  const saved = mockProperties.filter((p) => savedIds.includes(p.id))
  const filtered = filter === 'all' ? saved : saved.filter((p) => p.operation === filter)

  const remove = (id: string) => setSavedIds((prev) => prev.filter((s) => s !== id))

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-1">Mi cuenta</p>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Propiedades guardadas
        </h1>
        <p className="text-gray-500 text-sm mt-1">{saved.length} propiedades en tu lista</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'venta', 'alquiler'] as const).map((op) => (
          <button
            key={op}
            onClick={() => setFilter(op)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === op ? 'text-white' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
            }`}
            style={filter === op ? { backgroundColor: '#1A6B5A' } : undefined}
          >
            {op === 'all' ? 'Todas' : OPERATION_TYPE_LABELS[op]}
          </button>
        ))}
        <div className="ml-auto text-sm text-gray-400 flex items-center gap-1.5">
          <SlidersHorizontal size={14} />
          {filtered.length} resultados
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Heart size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 font-medium">No tenés propiedades guardadas</p>
          <Link
            href="/propiedades"
            className="mt-4 inline-block text-sm font-semibold hover:underline"
            style={{ color: '#1A6B5A' }}
          >
            Explorar propiedades →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:border-gray-200 hover:shadow-md transition-all">
              {/* Image */}
              <div className="relative h-44 bg-gray-100">
                <Image src={property.images[0]} alt={property.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
                <div className="absolute top-3 left-3">
                  {property.aiMatchScore !== undefined && <AIMatchBadge score={property.aiMatchScore} />}
                </div>
                <button
                  onClick={() => remove(property.id)}
                  className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-all"
                  title="Quitar de guardadas"
                >
                  <Trash2 size={14} className="text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#1A6B5A' }}>
                    {PROPERTY_TYPE_LABELS[property.type]}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {OPERATION_TYPE_LABELS[property.operation]}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">{property.title}</h3>
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                  <MapPin size={11} />
                  {property.neighborhood}, {property.city}
                </div>
                <div className="flex items-center gap-3 text-gray-500 text-xs mb-4 pb-3 border-b border-gray-50">
                  <span className="flex items-center gap-1"><BedDouble size={12} />{property.rooms} amb.</span>
                  <span className="flex items-center gap-1"><Maximize2 size={11} />{property.surface} m²</span>
                  <span className="flex items-center gap-1"><Bath size={12} />{property.bathrooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{formatPrice(property.price, property.currency)}</span>
                  <Link href={`/propiedades/${property.id}`} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90" style={{ backgroundColor: '#1A6B5A' }}>
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
