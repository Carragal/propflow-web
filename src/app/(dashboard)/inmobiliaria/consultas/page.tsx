'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp, Phone, Loader2, Star } from 'lucide-react'
import { api } from '@/lib/api'

type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  message?: string
  status: LeadStatus
  createdAt: string
  property: { id: string; title: string; address: string }
  user?: { id: string; name: string; email: string } | null
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  NEW:       { label: 'Nueva',      color: '#1A6B5A', bg: '#edf7f5', icon: Clock },
  CONTACTED: { label: 'Contactado', color: '#3b82f6', bg: '#eff6ff', icon: CheckCircle2 },
  QUALIFIED: { label: 'Calificado', color: '#f59e0b', bg: '#fffbeb', icon: Star },
  CLOSED:    { label: 'Cerrada',    color: '#9ca3af', bg: '#f3f4f6', icon: XCircle },
}

const FILTER_OPTIONS = [
  { value: 'all',       label: 'Todas' },
  { value: 'NEW',       label: 'Nuevas' },
  { value: 'CONTACTED', label: 'Contactados' },
  { value: 'QUALIFIED', label: 'Calificados' },
  { value: 'CLOSED',    label: 'Cerradas' },
] as const

type FilterValue = typeof FILTER_OPTIONS[number]['value']

function timeAgo(dateStr: string) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Ahora'
    if (mins < 60) return `Hace ${mins} min`
    const hs = Math.floor(mins / 60)
    if (hs < 24) return `Hace ${hs} hs`
    const days = Math.floor(hs / 24)
    if (days === 1) return 'Ayer'
    return `Hace ${days} días`
  } catch {
    return dateStr
  }
}

export default function ConsultasPage() {
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterValue>('all')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leads'],
    queryFn: () => api.get<{ items: Lead[]; meta: { total: number } }>('/leads'),
    staleTime: 1000 * 30,
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      api.patch(`/leads/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  })

  const leads: Lead[] = (data as any)?.items ?? []
  const filtered = filter === 'all' ? leads : leads.filter((l) => l.status === filter)
  const newCount = leads.filter((l) => l.status === 'NEW').length

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 size={24} className="animate-spin text-gray-300" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-gray-400 py-20">
        No se pudieron cargar las consultas.
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 mb-1">Inmobiliaria</p>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Consultas
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {newCount > 0 ? (
              <><span className="font-semibold text-gray-700">{newCount} consultas nuevas</span> sin responder</>
            ) : leads.length === 0 ? (
              'Aún no recibiste consultas'
            ) : (
              'Todas las consultas respondidas'
            )}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTER_OPTIONS.map(({ value, label }) => {
          const count = value === 'all' ? leads.length : leads.filter((l) => l.status === value).length
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filter === value ? 'text-white border-transparent' : 'text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
              style={filter === value ? { backgroundColor: '#1A6B5A' } : undefined}
            >
              {label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${filter === value ? 'bg-white/20' : 'bg-gray-100'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <MessageSquare size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 font-medium">No hay consultas en esta categoría</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => {
            const { label, color, bg, icon: StatusIcon } = STATUS_CONFIG[lead.status]
            const isExpanded = expanded === lead.id

            return (
              <div
                key={lead.id}
                className={`bg-white rounded-2xl border transition-all ${lead.status === 'NEW' ? 'border-emerald-200' : 'border-gray-100'}`}
              >
                {/* Header */}
                <button
                  className="w-full flex items-start gap-4 p-5 text-left"
                  onClick={() => setExpanded(isExpanded ? null : lead.id)}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: '#1A6B5A' }}
                  >
                    {lead.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900 text-sm">{lead.name}</p>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ color, backgroundColor: bg }}
                      >
                        <StatusIcon size={10} />
                        {label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">
                      {lead.property.title} · {timeAgo(lead.createdAt)}
                    </p>
                    {lead.message && (
                      <p className="text-xs text-gray-500 truncate">{lead.message}</p>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-gray-300 mt-1">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Expanded body */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-50">
                    {/* Contact info */}
                    <div className="flex flex-wrap gap-4 py-4 text-xs text-gray-500">
                      <a href={`mailto:${lead.email}`} className="hover:underline" style={{ color: '#1A6B5A' }}>
                        {lead.email}
                      </a>
                      {lead.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={11} />{lead.phone}
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    {lead.message && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-gray-700 leading-relaxed">{lead.message}</p>
                      </div>
                    )}

                    {/* Status actions */}
                    {lead.status !== 'CLOSED' && (
                      <div className="flex gap-2 flex-wrap">
                        {lead.status === 'NEW' && (
                          <button
                            onClick={() => updateStatus.mutate({ id: lead.id, status: 'CONTACTED' })}
                            disabled={updateStatus.isPending}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                            style={{ backgroundColor: '#1A6B5A' }}
                          >
                            {updateStatus.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            Marcar contactado
                          </button>
                        )}
                        {lead.status === 'CONTACTED' && (
                          <button
                            onClick={() => updateStatus.mutate({ id: lead.id, status: 'QUALIFIED' })}
                            disabled={updateStatus.isPending}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                            style={{ backgroundColor: '#f59e0b' }}
                          >
                            <Star size={14} /> Calificar
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus.mutate({ id: lead.id, status: 'CLOSED' })}
                          disabled={updateStatus.isPending}
                          className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
                        >
                          Cerrar consulta
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
