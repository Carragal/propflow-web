'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Eye, MessageSquare, TrendingUp, PlusCircle,
  ArrowUpRight, ArrowRight, MapPin, MoreHorizontal,
  CheckCircle2, Clock, XCircle,
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { mockProperties } from '@/lib/mockData'
import { formatPrice } from '@/lib/utils'
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants'

const AGENCY_LISTINGS = mockProperties.slice(0, 4)

const STATS = [
  { label: 'Propiedades activas', value: '4', change: '+1', positive: true, icon: TrendingUp },
  { label: 'Visitas este mes', value: '1.284', change: '+18%', positive: true, icon: Eye },
  { label: 'Consultas nuevas', value: '23', change: '+5', positive: true, icon: MessageSquare },
  { label: 'Conversión', value: '3,2%', change: '-0,4%', positive: false, icon: ArrowUpRight },
]

const INQUIRIES = [
  { name: 'Rodrigo M.', property: 'Departamento en Palermo', time: 'Hace 10 min', status: 'new' },
  { name: 'Valentina K.', property: 'Casa en Belgrano', time: 'Hace 2 hs', status: 'replied' },
  { name: 'Facundo L.', property: 'Oficina en Rosario', time: 'Ayer', status: 'new' },
  { name: 'Lucía P.', property: 'Depto en Mendoza', time: 'Ayer', status: 'closed' },
]

const STATUS_CONFIG = {
  new: { label: 'Nueva', color: '#1A6B5A', bg: '#edf7f5', icon: Clock },
  replied: { label: 'Respondida', color: '#3b82f6', bg: '#eff6ff', icon: CheckCircle2 },
  closed: { label: 'Cerrada', color: '#9ca3af', bg: '#f3f4f6', icon: XCircle },
}

export default function InmobiliariaDashboard() {
  const { user } = useAuthStore()
  const firstName = user?.name.split(' ')[0] ?? 'Usuario'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 mb-1">Panel inmobiliaria</p>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Bienvenido, {firstName}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Resumen de actividad — últimos 30 días
          </p>
        </div>
        <Link
          href="/inmobiliaria/publicar"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md"
          style={{ backgroundColor: '#1A6B5A' }}
        >
          <PlusCircle size={16} />
          Publicar propiedad
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, change, positive, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500">{label}</p>
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <Icon size={15} className="text-gray-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <p className={`text-xs font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
              {change} vs mes anterior
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Listings table */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Mis propiedades</h2>
            <Link href="/inmobiliaria/propiedades" className="text-xs font-medium hover:underline" style={{ color: '#1A6B5A' }}>
              Ver todas →
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {AGENCY_LISTINGS.map((property) => (
                <div key={property.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group">
                  <div className="relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{property.title}</p>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                      <MapPin size={10} />
                      {property.neighborhood} · {PROPERTY_TYPE_LABELS[property.type]} · {OPERATION_TYPE_LABELS[property.operation]}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(property.price, property.currency)}
                    </p>
                    <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 mt-0.5">
                      Activa
                    </span>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gray-100 transition-all">
                    <MoreHorizontal size={15} className="text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-50">
              <Link
                href="/inmobiliaria/publicar"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-emerald-300 hover:text-emerald-700 transition-all"
              >
                <PlusCircle size={16} />
                Agregar propiedad
              </Link>
            </div>
          </div>
        </div>

        {/* Inquiries */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Consultas recientes</h2>
            <Link href="/inmobiliaria/consultas" className="text-xs font-medium hover:underline" style={{ color: '#1A6B5A' }}>
              Ver todas →
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {INQUIRIES.map(({ name, property, time, status }) => {
                const { label, color, bg, icon: StatusIcon } = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
                return (
                  <div key={name} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: '#1A6B5A' }}
                    >
                      {name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{name}</p>
                      <p className="text-xs text-gray-400 truncate">{property}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ color, backgroundColor: bg }}
                        >
                          <StatusIcon size={10} />
                          {label}
                        </span>
                        <span className="text-xs text-gray-300">{time}</span>
                      </div>
                    </div>
                    <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
                      <ArrowRight size={14} className="text-gray-300" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Performance tip */}
          <div
            className="mt-4 rounded-2xl p-5"
            style={{ background: 'linear-gradient(135deg, #1A6B5A, #104538)' }}
          >
            <p className="text-white font-semibold text-sm mb-1">💡 Tip de rendimiento</p>
            <p className="text-emerald-200 text-xs leading-relaxed">
              Las propiedades con fotos profesionales reciben <strong className="text-white">3x más consultas</strong>. Actualizá las imágenes de tus listados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
