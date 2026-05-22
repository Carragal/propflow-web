'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2, MessageSquare, Building2, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const contactSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(1, 'Seleccioná un asunto'),
  message: z.string().min(20, 'Mínimo 20 caracteres'),
})

type ContactInput = z.infer<typeof contactSchema>

const SUBJECTS = [
  'Consulta general',
  'Soporte técnico',
  'Quiero publicar mi inmobiliaria',
  'Problema con una propiedad',
  'Facturación',
  'Otro',
]

const CONTACT_INFO = [
  { icon: Mail, label: 'Email', value: 'hola@casaai.com', href: 'mailto:hola@casaai.com' },
  { icon: Phone, label: 'WhatsApp', value: '+54 11 4000-1234', href: 'https://wa.me/5491140001234' },
  { icon: MapPin, label: 'Oficina', value: 'Av. Santa Fe 3241, CABA', href: null },
  { icon: Clock, label: 'Horario', value: 'Lun–Vie 9 a 18 hs', href: null },
]

const FAQS = [
  { q: '¿CasaAI es gratuito para compradores?', a: 'Sí, crear una cuenta como comprador o inquilino es completamente gratuito. Podés buscar, guardar propiedades y configurar alertas sin costo.' },
  { q: '¿Cómo funciona el score de match IA?', a: 'Completás tus preferencias en el perfil (tipo, zona, presupuesto, ambientes) y el algoritmo compara esas preferencias con cada propiedad para asignarte un porcentaje de compatibilidad.' },
  { q: '¿Puedo publicar propiedades como particular?', a: 'Sí, registrate con el rol "Inmobiliaria / Propietario" y podés publicar desde el panel. El plan incluye un período de prueba gratuito.' },
  { q: '¿Los datos de mercado son en tiempo real?', a: 'Los datos de precios y tendencias se actualizan diariamente a partir de las publicaciones activas en la plataforma.' },
]

export default function ContactoPage() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: '' },
  })

  const onSubmit = async (_data: ContactInput) => {
    setSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSending(false)
    setSent(true)
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="pt-24 pb-16" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 60%)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: '#edf7f5', color: '#1A6B5A' }}>
            <MessageSquare size={13} /> Estamos para ayudarte
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Contacto
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            Respondemos en menos de 24 horas hábiles. También podés escribirnos por WhatsApp.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Contact info + FAQ */}
          <div className="space-y-6">
            {/* Info cards */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Información de contacto</h2>
              <div className="space-y-4">
                {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#edf7f5' }}>
                      <Icon size={15} style={{ color: '#1A6B5A' }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm font-medium text-gray-800 hover:underline" style={{ color: '#1A6B5A' }}>{value}</a>
                      ) : (
                        <p className="text-sm font-medium text-gray-800">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agency CTA */}
            <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #1A6B5A, #104538)' }}>
              <Building2 size={22} className="text-white mb-3" />
              <p className="text-white font-semibold mb-1">¿Sos una inmobiliaria?</p>
              <p className="text-emerald-200 text-xs mb-4 leading-relaxed">Publicá tus propiedades y gestioná todo desde un panel profesional.</p>
              <a href="/registro" className="inline-block px-4 py-2 bg-white rounded-xl text-xs font-semibold hover:bg-emerald-50 transition-all" style={{ color: '#1A6B5A' }}>
                Registrar mi inmobiliaria →
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#edf7f5' }}>
                    <CheckCircle2 size={28} style={{ color: '#1A6B5A' }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-gray-500 text-sm">Te respondemos en menos de 24 horas hábiles.</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-sm font-semibold hover:underline" style={{ color: '#1A6B5A' }}>
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-bold text-gray-900 mb-6">Envianos un mensaje</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre completo</label>
                        <input {...register('name')} placeholder="Tu nombre" className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-400', errors.name ? 'border-red-300' : 'border-gray-200')} />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                        <input {...register('email')} placeholder="tu@email.com" className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-400', errors.email ? 'border-red-300' : 'border-gray-200')} />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Asunto</label>
                      <select {...register('subject')} className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none bg-white', errors.subject ? 'border-red-300' : 'border-gray-200')}>
                        <option value="">Seleccioná un asunto</option>
                        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Mensaje</label>
                      <textarea {...register('message')} rows={5} placeholder="Contanos en qué podemos ayudarte..." className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-400 resize-none', errors.message ? 'border-red-300' : 'border-gray-200')} />
                      {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                    </div>
                    <button type="submit" disabled={sending} className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-60 transition-all" style={{ backgroundColor: '#1A6B5A' }}>
                      {sending ? <><Loader2 size={15} className="animate-spin" />Enviando...</> : <><Send size={15} />Enviar mensaje</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <HelpCircle size={28} className="mx-auto mb-3 text-gray-200" />
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Preguntas frecuentes
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-medium text-gray-900 text-sm pr-4">{q}</span>
                  <span className="text-gray-400 flex-shrink-0 text-lg leading-none">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
