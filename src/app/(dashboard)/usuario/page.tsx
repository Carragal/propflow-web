'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Search, Bell, Sparkles, ArrowRight, MapPin, TrendingUp, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'

interface FavoriteProperty {
  id: string
  title: string
  price: number
  currency: 'USD' | 'ARS'
  neighborhood: string
  city: string
  images: string[]
  aiMatchScore?: number
}

interface Favorite {
  id: string
  propertyId: string
  property: FavoriteProperty
}

const RECENT_SEARCHES = [
  { label: 'Departamentos en venta · Palermo', count: 24 },
  { label: 'Casas · Belgrano · 3+ amb', count: 11 },
]

export default function UsuarioDashboard() {
  const { user } = useAuthStore()
  const firstName = user?.name.split(' ')[0] ?? 'Usuario'

  const { data: favorites = [], isLoading } = useQuery<Favorite[]>({
    queryKey: ['favorites'],
    queryFn: () => api.get<Favorite[]>('/favorites'),
    enabled: !!user,
    staleTime: 1000 * 30,
  })

  const savedCount = favorites.length
  const previewFavorites = favorites.slice(0, 3)

  const QUICK_ACTIONS = [
    { icon: Heart, label: 'Guardadas', count: savedCount, href: '/usuario/guardadas', color: '#ef4444' },
    { icon: Search, label: 'Búsquedas guardadas', count: 2, href: '/usuario/busquedas', color: '#3b82f6' },
    { icon: Bell, label: 'Alertas activas', count: 1, href: '/usuario/alertas', color: '#f59e0b' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-1">Panel de usuario</p>
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Hola, {firstName} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Tenés{' '}
          <span className="font-semibold text-gray-700">
            {isLoading ? '…' : `${savedCount} propiedad${savedCount !== 1 ? 'es' : ''} guardada${savedCount !== 1 ? 's' : ''}`}
          </span>{' '}
          y <span className="font-semibold text-gray-700">1 alerta activa</span>.
        </p>
      </div>

      {/* AI match banner */}
      <div
        className="rounded-2xl p-5 mb-8 flex items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #1A6B5A, #104538)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">Tu perfil de búsqueda está incompleto</p>
            <p className="text-emerald-200 text-xs">
              Completalo para mejorar tu score de match IA en las propiedades.
            </p>
          </div>
        </div>
        <Link
          href="/usuario/perfil"
          className="flex-shrink-0 px-4 py-2 bg-white rounded-xl text-sm font-semibold transition-all hover:bg-emerald-50"
          style={{ color: '#1A6B5A' }}
        >
          Completar
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {QUICK_ACTIONS.map(({ icon: Icon, label, count, href, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: color + '15' }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">
              {isLoading && href === '/usuario/guardadas' ? '…' : count}
            </p>
            <p className="text-xs text-gray-500">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Saved properties */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Propiedades guardadas</h2>
            <Link href="/usuario/guardadas" className="text-xs font-medium hover:underline" style={{ color: '#1A6B5A' }}>
              Ver todas →
            </Link>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-gray-300" />
            </div>
          ) : previewFavorites.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Heart size={30} className="mx-auto text-gray-200 mb-2" />
              <p className="text-gray-500 text-sm">No tenés propiedades guardadas</p>
              <Link href="/propiedades" className="mt-3 inline-block text-sm font-semibold hover:underline" style={{ color: '#1A6B5A' }}>
                Explorar propiedades →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {previewFavorites.map(({ id, propertyId, property: p }) => (
                <Link
                  key={id}
                  href={`/propiedades/${propertyId}`}
                  className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all group"
                >
                  <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors mb-0.5">
                      {p.title}
                    </p>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <MapPin size={10} />
                      {[p.neighborhood, p.city].filter(Boolean).join(', ')}
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(p.price, p.currency)}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-4">
          {/* Recent searches */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Búsquedas recientes</h3>
            <div className="space-y-3">
              {RECENT_SEARCHES.map(({ label, count }) => (
                <Link
                  key={label}
                  href="/propiedades"
                  className="flex items-center justify-between group"
                >
                  <p className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors leading-snug pr-2">
                    {label}
                  </p>
                  <span className="text-xs text-gray-400 flex-shrink-0 bg-gray-100 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Market tip */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={15} className="text-amber-600" />
              <p className="text-xs font-semibold text-amber-700">Dato de mercado</p>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              Los precios en Palermo subieron un <strong>4,2%</strong> en los últimos 30 días.
              Es un buen momento para tomar decisión.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
