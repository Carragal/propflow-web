'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bath, BedDouble, Car, Maximize2, MapPin, Video } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Property } from '@/types/property'
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants'
import AIMatchBadge from '@/components/shared/AIMatchBadge'
import PriceTag from '@/components/shared/PriceTag'

interface PropertyCardProps {
  property: Property
  index?: number
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {property.aiMatchScore !== undefined && (
            <AIMatchBadge score={property.aiMatchScore} />
          )}
          {property.has360Tour && (
            <span className="inline-flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
              <Video size={9} />
              Tour 360°
            </span>
          )}
        </div>

        {/* Operation badge */}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
            {OPERATION_TYPE_LABELS[property.operation]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Type + location */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-xs font-medium text-brand-600 uppercase tracking-wide">
            {PROPERTY_TYPE_LABELS[property.type]}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-brand-600 transition-colors" style={{ fontFamily: 'inherit' }}>
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin size={11} className="flex-shrink-0" />
          <span className="truncate">{property.neighborhood}, {property.city}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-gray-600 text-xs mb-4 border-t border-gray-50 pt-3">
          {property.rooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} />
              {property.rooms} amb.
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize2 size={12} />
            {property.surface} m²
          </span>
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath size={12} />
              {property.bathrooms}
            </span>
          )}
          {property.parking > 0 && (
            <span className="flex items-center gap-1">
              <Car size={12} />
              {property.parking}
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <PriceTag price={property.price} currency={property.currency} size="sm" />
          <Link
            href={`/propiedades/${property.id}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: '#1A6B5A' }}
          >
            Ver más
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
