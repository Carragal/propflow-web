import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Bath,
  BedDouble,
  Car,
  Maximize2,
  MapPin,
  Video,
  ChevronRight,
  CheckCircle2,
  CalendarDays,
  Building2,
} from 'lucide-react'
import { mockProperties } from '@/lib/mockData'
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import ImageGallery from '@/components/properties/ImageGallery'
import ContactCard from '@/components/properties/ContactCard'
import AIMatchBadge from '@/components/shared/AIMatchBadge'
import PropertyGrid from '@/components/properties/PropertyGrid'
import PropertyMapClient from '@/components/properties/PropertyMapClient'

export function generateStaticParams() {
  return mockProperties.map((p) => ({ id: p.id }))
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = mockProperties.find((p) => p.id === id)
  if (!property) notFound()

  // Mock extra images by repeating/varying the main image
  const images = [
    property.images[0],
    property.images[0].replace('w=800', 'w=801'),
    property.images[0].replace('w=800', 'w=802'),
  ]

  const similar = mockProperties
    .filter((p) => p.id !== property.id && p.type === property.type)
    .slice(0, 3)

  const stats = [
    { icon: BedDouble, label: 'Ambientes', value: property.rooms > 0 ? `${property.rooms} amb.` : '—' },
    { icon: Maximize2, label: 'Superficie', value: `${property.surface} m²` },
    { icon: Bath, label: 'Baños', value: property.bathrooms > 0 ? property.bathrooms : '—' },
    { icon: Car, label: 'Cocheras', value: property.parking > 0 ? property.parking : '—' },
  ]

  return (
    <div className="pt-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600 transition-colors">Inicio</Link>
          <ChevronRight size={12} />
          <Link href="/propiedades" className="hover:text-gray-600 transition-colors">Propiedades</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 truncate max-w-[200px]">{property.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left / Main ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <ImageGallery images={images} title={property.title} />

            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: '#1A6B5A' }}
                >
                  {PROPERTY_TYPE_LABELS[property.type]}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {OPERATION_TYPE_LABELS[property.operation]}
                </span>
                {property.has360Tour && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    <Video size={11} />
                    Tour 360°
                  </span>
                )}
                {property.aiMatchScore !== undefined && (
                  <AIMatchBadge score={property.aiMatchScore} size="md" />
                )}
              </div>

              <h1
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-snug"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                {property.title}
              </h1>

              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <MapPin size={14} className="flex-shrink-0" />
                <span>
                  {property.address}, {property.neighborhood}, {property.city},{' '}
                  {property.province}
                </span>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center"
                >
                  <Icon size={20} className="text-gray-400 mb-2" />
                  <p className="text-lg font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Descripción</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{property.description}</p>
            </div>

            {/* Features */}
            {property.features.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Características y comodidades</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-3"
                    >
                      <CheckCircle2 size={15} style={{ color: '#1A6B5A' }} className="flex-shrink-0" />
                      <span className="text-sm text-gray-700 capitalize">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General info */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Información general</h2>
              <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {[
                  { label: 'Tipo', value: PROPERTY_TYPE_LABELS[property.type] },
                  { label: 'Operación', value: OPERATION_TYPE_LABELS[property.operation] },
                  { label: 'Superficie', value: `${property.surface} m²` },
                  { label: 'Ambientes', value: property.rooms },
                  { label: 'Baños', value: property.bathrooms },
                  { label: 'Cocheras', value: property.parking },
                  { label: 'Barrio', value: property.neighborhood },
                  { label: 'Ciudad', value: `${property.city}, ${property.province}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Ubicación</h2>
              <div className="h-64 rounded-2xl overflow-hidden border border-gray-100">
                <PropertyMapClient
                  properties={[property]}
                  className="w-full h-full"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                La ubicación mostrada es aproximada para proteger la privacidad del propietario.
              </p>
            </div>
          </div>

          {/* ── Right / Sidebar ───────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Price card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {formatPrice(property.price, property.currency)}
                </p>
                {property.operation === 'alquiler' && (
                  <p className="text-xs text-gray-400">por mes</p>
                )}
                {property.aiMatchScore !== undefined && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-500">Tu score de match IA</span>
                      <span className="text-sm font-bold" style={{ color: '#1A6B5A' }}>
                        {property.aiMatchScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${property.aiMatchScore}%`,
                          backgroundColor: '#1A6B5A',
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Basado en tu perfil y preferencias.
                    </p>
                  </div>
                )}
              </div>

              {/* Contact */}
              <ContactCard />

              {/* Meta */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays size={13} />
                  <span>Publicado el{' '}
                    {new Date(property.createdAt).toLocaleDateString('es-AR', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Building2 size={13} />
                  <span>ID de propiedad: {property.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: '#1A6B5A' }}>
                  Te puede interesar
                </p>
                <h2 className="text-2xl font-bold text-gray-900">Propiedades similares</h2>
              </div>
              <Link
                href="/propiedades"
                className="text-sm font-semibold hover:underline hidden sm:block"
                style={{ color: '#1A6B5A' }}
              >
                Ver todas →
              </Link>
            </div>
            <PropertyGrid properties={similar} />
          </div>
        )}
      </div>
    </div>
  )
}
