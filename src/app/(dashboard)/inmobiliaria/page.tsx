'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { Eye, MessageSquare, TrendingUp, PlusCircle, ArrowRight, MapPin, MoreHorizontal, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants'

function timeAgo(dateStr: string) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Ahora'
    if (mins < 60) return `Hace ${mins} min`
    const hs = Math.floor(mins / 60)
    if (hs < 24) return `Hace ${hs} hs`
    const days = Math.floor(hs / 24)
    return days === 1 ? 'Ayer' : `Hace ${days} días`
  } catch { return '' }
}

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  NEW:       { color: '#1A6B5A', bg: '#edf7f5' },
  CONTACTED: { color: '#3b82f6', bg: '#eff6ff' },
  QUALIFIED: { color: '#f59e0b', bg: '#fffbeb' },
  CLOSED:    { color: '#9ca3af', bg: '#f3f4f6' },
}
const STATUS_LABELS: Record<string, string> = {
  NEW: 'Nueva', CONTACTED: 'Contactado', QUALIFIED: 'Calificado', CLOSED: 'Cerrada',
}

export default function InmobiliariaDashboard() {
  const { user } = useAuthStore()
  const firstName = user?.name?.split(' ')[0] ?? 'Usuario'

  const { data: propsData, isLoading: loadingProps } = useQuery({
    queryKey: ['dashboard-properties'],
    queryFn: () => api.get<any>('/properties?limit=4&offset=0'),
    staleTime: 1000 * 60,
  })

  const { data: leadsData, isLoading: loadingLeads } = useQuery({
    queryKey: ['dashboard-leads'],
    queryFn: () => api.get<any>('/leads?limit=4&offset=0'),
    staleTime: 1000 * 30,
  })

  const properties = (propsData as any)?.items ?? []
  const totalProps = (propsData as any)?.meta?.total ?? 0
  const leads = (leadsData as any)?.items ?? []
  const totalLeads = (leadsData as any)?.meta?.total ?? 0
  const newLeads = leads.filter((l: any) => l.status === 'NEW').length

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 mb-1">Panel inmobiliaria</p>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Bienvenido, {firstName}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Resumen de actividad</p>
        </div>
        <Link
          href="/inmobiliaria/publicar"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: '#1A6B5A' }}
        >
          <PlusCircle size={16} />
          Publicar propiedad
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500">Propiedades activas</p>
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <TrendingUp size={15} className="text-gray-400" />
            </div>
          </div>
          {loadingProps ? <Loader2 size={20} className="animate-spin text-gray-300" /> : (
            <p className="text-2xl font-bold text-gray-900">{totalProps}</p>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500">Consultas totales</p>
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <MessageSquare size={15} className="text-gray-400" />
            </div>
          </div>
          {loadingLeads ? <Loader2 size={20} className="animate-spin text-gray-300" /> : (
            <>
              <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
              {newLeads > 0 && <p className="text-xs font-medium text-emerald-600 mt-1">{newLeads} sin responder</p>}
            </>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500">Vistas totales</p>
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <Eye size={15} className="text-gray-400" />
            </div>
          </div>
          {loadingProps ? <Loader2 size={20} className="animate-spin text-gray-300" /> : (
            <p className="text-2xl font-bold text-gray-900">
              {properties.reduce((acc: number, p: any) => acc + (p.views ?? 0), 0).toLocaleString('es-AR')}
            </p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Properties */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Mis propiedades</h2>
            <Link href="/inmobiliaria/propiedades" className="text-xs font-medium hover:underline" style={{ color: '#1A6B5A' }}>Ver todas →</Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {loadingProps ? (
              <div className="p-8 flex justify-center"><Loader2 size={20} className="animate-spin text-gray-300" /></div>
            ) : (
              <div className="divide-y divide-gray-50">
                {properties.slice(0, 4).map((p: any) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group">
                    <div className="relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {p.images?.[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="64px" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.title}</p>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                        <MapPin size={10} />
                        {p.neighborhood} · {PROPERTY_TYPE_LABELS[p.type?.toLowerCase()]} · {OPERATION_TYPE_LABELS[p.operation?.toLowerCase()]}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">{formatPrice(p.price, p.currency)}</p>
                      <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 mt-0.5">Activa</span>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gray-100 transition-all">
                      <MoreHorizontal size={15} className="text-gray-400" />
                    </button>
                  </div>
                ))}
                {properties.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-sm">No tenés propiedades aún</div>
                )}
              </div>
            )}
            <div className="p-4 border-t border-gray-50">
              <Link href="/inmobiliaria/publicar" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-emerald-300 hover:text-emerald-700 transition-all">
                <PlusCircle size={16} /> Agregar propiedad
              </Link>
            </div>
          </div>
        </div>

        {/* Leads */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Consultas recientes</h2>
            <Link href="/inmobiliaria/consultas" className="text-xs font-medium hover:underline" style={{ color: '#1A6B5A' }}>Ver todas →</Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {loadingLeads ? (
              <div className="p-8 flex justify-center"><Loader2 size={20} className="animate-spin text-gray-300" /></div>
            ) : leads.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No hay consultas aún</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {leads.slice(0, 4).map((lead: any) => {
                  const sc = STATUS_COLORS[lead.status] ?? STATUS_COLORS.NEW
                  return (
                    <div key={lead.id} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: '#1A6B5A' }}>
                        {lead.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-400 truncate">{lead.property?.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: sc.color, backgroundColor: sc.bg }}>
                            {STATUS_LABELS[lead.status] ?? lead.status}
                          </span>
                          <span className="text-xs text-gray-300">{timeAgo(lead.createdAt)}</span>
                        </div>
                      </div>
                      <Link href="/inmobiliaria/consultas">
                        <ArrowRight size={14} className="text-gray-300 hover:text-gray-500 mt-1" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div className="mt-4 rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #1A6B5A, #104538)' }}>
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
