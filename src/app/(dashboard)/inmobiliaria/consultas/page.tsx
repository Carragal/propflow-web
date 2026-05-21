'use client'

import { useState } from 'react'
import { MessageSquare, CheckCircle2, Clock, XCircle, Send, ChevronDown, ChevronUp, Phone } from 'lucide-react'

type InquiryStatus = 'new' | 'replied' | 'closed'

interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  property: string
  propertyId: string
  message: string
  time: string
  status: InquiryStatus
  reply?: string
}

const STATUS_CONFIG: Record<InquiryStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  new: { label: 'Nueva', color: '#1A6B5A', bg: '#edf7f5', icon: Clock },
  replied: { label: 'Respondida', color: '#3b82f6', bg: '#eff6ff', icon: CheckCircle2 },
  closed: { label: 'Cerrada', color: '#9ca3af', bg: '#f3f4f6', icon: XCircle },
}

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: '1',
    name: 'Rodrigo Méndez',
    email: 'rodrigo.m@email.com',
    phone: '+54 11 4523-8891',
    property: 'Departamento en Palermo',
    propertyId: '1',
    message: '¡Hola! Me interesa mucho el departamento. ¿Está disponible para visitar este sábado? ¿Cuáles son los gastos expensas aproximados?',
    time: 'Hace 10 min',
    status: 'new',
  },
  {
    id: '2',
    name: 'Valentina Kowalski',
    email: 'vale.k@gmail.com',
    property: 'Casa en Belgrano',
    propertyId: '2',
    message: '¿La propiedad acepta mascotas? Tenemos un perro mediano. También quería saber si hay lugar para dos autos.',
    time: 'Hace 2 hs',
    status: 'replied',
    reply: 'Hola Valentina, sí acepta mascotas y cuenta con cochera para 2 vehículos. Podemos coordinar una visita cuando quieras.',
  },
  {
    id: '3',
    name: 'Facundo López',
    email: 'facundo.l@outlook.com',
    phone: '+54 341 6677-2234',
    property: 'Oficina en Rosario',
    propertyId: '3',
    message: 'Somos una empresa de 8 personas buscando una oficina. ¿Tiene sala de reuniones? ¿Qué incluye el precio?',
    time: 'Ayer',
    status: 'new',
  },
  {
    id: '4',
    name: 'Lucía Peralta',
    email: 'lucia.p@email.com',
    property: 'Depto en Mendoza',
    propertyId: '4',
    message: 'Consulta por el precio. ¿Es negociable? Tenemos efectivo disponible.',
    time: 'Ayer',
    status: 'closed',
    reply: 'Gracias por tu consulta. El precio es fijo pero podemos hablar. Escribime para coordinar.',
  },
  {
    id: '5',
    name: 'Martín Sosa',
    email: 'martin.sosa@gmail.com',
    phone: '+54 11 5544-3322',
    property: 'Departamento en Palermo',
    propertyId: '1',
    message: '¿Cuándo podría ir a verlo? Estoy disponible cualquier día de la semana después de las 18 hs.',
    time: 'Hace 2 días',
    status: 'new',
  },
]

export default function ConsultasPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES)
  const [expanded, setExpanded] = useState<string | null>('1')
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | 'all'>('all')

  const filtered = filterStatus === 'all' ? inquiries : inquiries.filter((i) => i.status === filterStatus)

  const sendReply = (id: string) => {
    const text = replyText[id]?.trim()
    if (!text) return
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'replied', reply: text } : i))
    )
    setReplyText((prev) => ({ ...prev, [id]: '' }))
  }

  const closeInquiry = (id: string) => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'closed' } : i)))
  }

  const newCount = inquiries.filter((i) => i.status === 'new').length

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
            ) : (
              'Todas las consultas respondidas'
            )}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'new', 'replied', 'closed'] as const).map((s) => {
          const count = s === 'all' ? inquiries.length : inquiries.filter((i) => i.status === s).length
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterStatus === s ? 'text-white border-transparent' : 'text-gray-500 border-gray-200 hover:border-gray-300'}`}
              style={filterStatus === s ? { backgroundColor: '#1A6B5A' } : undefined}
            >
              {s === 'all' ? 'Todas' : STATUS_CONFIG[s].label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${filterStatus === s ? 'bg-white/20' : 'bg-gray-100'}`}>
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
          {filtered.map((inquiry) => {
            const { label, color, bg, icon: StatusIcon } = STATUS_CONFIG[inquiry.status]
            const isExpanded = expanded === inquiry.id

            return (
              <div key={inquiry.id} className={`bg-white rounded-2xl border transition-all ${inquiry.status === 'new' ? 'border-emerald-200' : 'border-gray-100'}`}>
                {/* Header */}
                <button
                  className="w-full flex items-start gap-4 p-5 text-left"
                  onClick={() => setExpanded(isExpanded ? null : inquiry.id)}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: '#1A6B5A' }}
                  >
                    {inquiry.name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900 text-sm">{inquiry.name}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ color, backgroundColor: bg }}>
                        <StatusIcon size={10} />
                        {label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{inquiry.property} · {inquiry.time}</p>
                    <p className="text-xs text-gray-500 truncate">{inquiry.message}</p>
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
                      <a href={`mailto:${inquiry.email}`} className="hover:underline" style={{ color: '#1A6B5A' }}>{inquiry.email}</a>
                      {inquiry.phone && (
                        <span className="flex items-center gap-1"><Phone size={11} />{inquiry.phone}</span>
                      )}
                    </div>

                    {/* Message */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <p className="text-sm text-gray-700 leading-relaxed">{inquiry.message}</p>
                    </div>

                    {/* Existing reply */}
                    {inquiry.reply && (
                      <div className="flex gap-3 mb-4">
                        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#1A6B5A' }}>
                          Yo
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-3 flex-1">
                          <p className="text-xs text-gray-500 mb-1">Tu respuesta</p>
                          <p className="text-sm text-gray-700">{inquiry.reply}</p>
                        </div>
                      </div>
                    )}

                    {/* Reply form — only for non-closed */}
                    {inquiry.status !== 'closed' && (
                      <div className="space-y-3">
                        <textarea
                          value={replyText[inquiry.id] ?? ''}
                          onChange={(e) => setReplyText((prev) => ({ ...prev, [inquiry.id]: e.target.value }))}
                          placeholder="Escribí tu respuesta..."
                          rows={3}
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => sendReply(inquiry.id)}
                            disabled={!replyText[inquiry.id]?.trim()}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                            style={{ backgroundColor: '#1A6B5A' }}
                          >
                            <Send size={14} /> Enviar respuesta
                          </button>
                          <button
                            onClick={() => closeInquiry(inquiry.id)}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
                          >
                            Cerrar consulta
                          </button>
                        </div>
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
