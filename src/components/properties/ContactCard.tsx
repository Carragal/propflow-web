'use client'

import { useState } from 'react'
import { Phone, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'

interface ContactCardProps {
  propertyId: string
  agentName?: string
  agencyName?: string
}

export default function ContactCard({
  propertyId,
  agentName = 'Agente CasaAI',
  agencyName = 'CasaAI',
}: ContactCardProps) {
  const user = useAuthStore((s) => s.user)
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [message, setMessage] = useState(
    'Hola, me interesa esta propiedad y quisiera más información.',
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await api.post('/leads', { name, email, phone, message, propertyId })
      setSent(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al enviar la consulta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      {/* Agent info */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: '#1A6B5A' }}
        >
          {agentName.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{agentName}</p>
          <p className="text-xs text-gray-500">{agencyName}</p>
        </div>
      </div>

      {sent ? (
        <div className="py-4 text-center">
          <CheckCircle2 size={32} className="mx-auto mb-2" style={{ color: '#1A6B5A' }} />
          <p className="font-semibold text-gray-900 text-sm">¡Consulta enviada!</p>
          <p className="text-xs text-gray-500 mt-1">El agente te contactará pronto.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
          <input
            type="text"
            placeholder="Tu nombre"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors"
          />
          <input
            type="email"
            placeholder="Tu email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors"
          />
          <input
            type="tel"
            placeholder="Tu teléfono (opcional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors"
          />
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            style={{ backgroundColor: '#1A6B5A' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar consulta'
            )}
          </button>
        </form>
      )}

      <div className="flex gap-2 mt-3">
        <a
          href="tel:+5491100000000"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
        >
          <Phone size={13} />
          Llamar
        </a>
        <a
          href="https://wa.me/5491100000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white rounded-xl transition-all hover:opacity-90"
          style={{ backgroundColor: '#25D366' }}
        >
          <MessageSquare size={13} />
          WhatsApp
        </a>
      </div>
    </div>
  )
}
