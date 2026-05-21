'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2, Building2, Mail, Phone, Globe, MapPin, Bell, Shield, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ARGENTINIAN_CITIES } from '@/lib/constants'

const agencySchema = z.object({
  agencyName: z.string().min(2, 'Mínimo 2 caracteres'),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z.string().optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  city: z.string(),
  address: z.string().optional(),
  description: z.string().max(300, 'Máximo 300 caracteres').optional(),
})

type AgencyInput = z.infer<typeof agencySchema>

const NOTIFICATION_OPTIONS = [
  { key: 'newInquiry', label: 'Nueva consulta recibida', description: 'Aviso inmediato cuando alguien consulta una propiedad' },
  { key: 'inquiryReminder', label: 'Recordatorio de consultas sin responder', description: 'Si pasan 24 hs sin responder' },
  { key: 'weeklySummary', label: 'Resumen semanal de actividad', description: 'Estadísticas de la semana todos los lunes' },
  { key: 'priceAlerts', label: 'Alertas de precio en el mercado', description: 'Cambios relevantes en propiedades similares' },
]

export default function ConfigPage() {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    newInquiry: true,
    inquiryReminder: true,
    weeklySummary: false,
    priceAlerts: false,
  })
  const [primaryColor, setPrimaryColor] = useState('#1A6B5A')

  const COLORS = ['#1A6B5A', '#2563eb', '#7c3aed', '#dc2626', '#d97706', '#0891b2']

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AgencyInput>({
    resolver: zodResolver(agencySchema),
    defaultValues: {
      agencyName: 'Reinvent Propiedades',
      contactEmail: 'admin@reinvent.com',
      contactPhone: '+54 11 4000-1234',
      website: 'https://reinvent.com.ar',
      city: 'Buenos Aires',
      address: 'Av. Santa Fe 3241, Palermo',
      description: 'Inmobiliaria con más de 10 años de experiencia en el mercado porteño.',
    },
  })

  const description = watch('description') ?? ''

  const onSubmit = async (_data: AgencyInput) => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 900))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleNotif = (key: string) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-1">Inmobiliaria</p>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Configuración
        </h1>
      </div>

      <div className="space-y-6">
        {/* Agency info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 size={16} className="text-gray-400" />
            <h2 className="font-bold text-gray-900">Datos de la inmobiliaria</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre de la inmobiliaria</label>
                <input {...register('agencyName')} className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-400', errors.agencyName ? 'border-red-300' : 'border-gray-200')} />
                {errors.agencyName && <p className="mt-1 text-xs text-red-600">{errors.agencyName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1"><Mail size={12} />Email de contacto</label>
                <input {...register('contactEmail')} className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-400', errors.contactEmail ? 'border-red-300' : 'border-gray-200')} />
                {errors.contactEmail && <p className="mt-1 text-xs text-red-600">{errors.contactEmail.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1"><Phone size={12} />Teléfono</label>
                <input {...register('contactPhone')} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1"><Globe size={12} />Sitio web</label>
                <input {...register('website')} placeholder="https://" className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-400', errors.website ? 'border-red-300' : 'border-gray-200')} />
                {errors.website && <p className="mt-1 text-xs text-red-600">{errors.website.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1"><MapPin size={12} />Ciudad</label>
                <select {...register('city')} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white">
                  {ARGENTINIAN_CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Dirección</label>
                <input {...register('address')} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Descripción breve</label>
                <textarea {...register('description')} rows={3} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 resize-none" />
                <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/300</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all" style={{ backgroundColor: '#1A6B5A' }}>
                {saving ? <><Loader2 size={14} className="animate-spin" />Guardando...</> : 'Guardar cambios'}
              </button>
              {saved && <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#1A6B5A' }}><CheckCircle2 size={15} />¡Guardado!</span>}
            </div>
          </form>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-gray-400" />
            <h2 className="font-bold text-gray-900">Notificaciones</h2>
          </div>
          <div className="space-y-4">
            {NOTIFICATION_OPTIONS.map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                </div>
                <button
                  onClick={() => toggleNotif(key)}
                  className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: notifications[key] ? '#1A6B5A' : '#e5e7eb' }}
                  role="switch"
                  aria-checked={notifications[key]}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                    style={{ transform: notifications[key] ? 'translateX(22px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Brand color */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Palette size={16} className="text-gray-400" />
            <h2 className="font-bold text-gray-900">Color de marca</h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">Se aplicará en las insignias y botones de tus publicaciones.</p>
          <div className="flex items-center gap-3">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setPrimaryColor(c)}
                className="w-9 h-9 rounded-full border-2 transition-all"
                style={{ backgroundColor: c, borderColor: primaryColor === c ? '#1f2937' : 'transparent' }}
                title={c}
              />
            ))}
            <div className="ml-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-xs font-mono text-gray-600">{primaryColor}</span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} className="text-gray-400" />
            <h2 className="font-bold text-gray-900">Seguridad</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-left">
              <div>
                <p className="text-sm font-medium text-gray-800">Cambiar contraseña</p>
                <p className="text-xs text-gray-400 mt-0.5">Última actualización hace 45 días</p>
              </div>
              <span className="text-xs font-semibold" style={{ color: '#1A6B5A' }}>Cambiar →</span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-left">
              <div>
                <p className="text-sm font-medium text-gray-800">Autenticación en dos pasos</p>
                <p className="text-xs text-gray-400 mt-0.5">No configurado</p>
              </div>
              <span className="text-xs font-semibold text-amber-600">Activar →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
