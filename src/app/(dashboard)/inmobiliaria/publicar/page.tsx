'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2, Home, MapPin, DollarSign, Camera, ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ARGENTINIAN_CITIES, PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS, PROPERTY_FEATURES } from '@/lib/constants'

const STEPS = ['Tipo y operación', 'Ubicación', 'Características', 'Precio y fotos'] as const

const listingSchema = z.object({
  operation: z.enum(['venta', 'alquiler']),
  type: z.enum(['departamento', 'casa', 'terreno', 'local', 'oficina']),
  title: z.string().min(5, 'Mínimo 5 caracteres'),
  city: z.string(),
  neighborhood: z.string().min(2, 'Ingresá el barrio'),
  address: z.string().optional(),
  surface: z.number().min(1, 'Requerido'),
  rooms: z.number().min(0),
  bathrooms: z.number().min(0),
  currency: z.enum(['USD', 'ARS']),
  price: z.number().min(1, 'Requerido'),
  description: z.string().min(20, 'Mínimo 20 caracteres'),
})

type ListingInput = z.infer<typeof listingSchema>

const TYPES = ['departamento', 'casa', 'terreno', 'local', 'oficina'] as const

export default function PublicarPage() {
  const [step, setStep] = useState(0)
  const [features, setFeatures] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<ListingInput>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      operation: 'venta',
      type: 'departamento',
      currency: 'USD',
      city: 'Buenos Aires',
      rooms: 2,
      bathrooms: 1,
    },
  })

  const operation = watch('operation')
  const type = watch('type')
  const currency = watch('currency')

  const toggleFeature = (f: string) =>
    setFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f])

  const STEP_FIELDS: (keyof ListingInput)[][] = [
    ['operation', 'type', 'title'],
    ['city', 'neighborhood', 'address'],
    ['surface', 'rooms', 'bathrooms'],
    ['currency', 'price', 'description'],
  ]

  const next = async () => {
    const valid = await trigger(STEP_FIELDS[step])
    if (valid) setStep((s) => s + 1)
  }

  const onSubmit = async (data: ListingInput) => {
    setSubmitting(true)
    try {
      const { api } = await import('@/lib/api')
      await api.post('/properties', {
        ...data,
        type: data.type.toUpperCase(),
        operation: data.operation.toUpperCase(),
        features,
        images: [],
      })
      setSubmitted(true)
    } catch {
      // show error silently
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#edf7f5' }}>
            <CheckCircle2 size={32} style={{ color: '#1A6B5A' }} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            ¡Propiedad publicada!
          </h2>
          <p className="text-gray-500 text-sm mb-6">Tu publicación está en revisión y será visible en minutos.</p>
          <button
            onClick={() => { setSubmitted(false); setStep(0) }}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ backgroundColor: '#1A6B5A' }}
          >
            Publicar otra
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-1">Inmobiliaria</p>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Publicar propiedad
        </h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  backgroundColor: i <= step ? '#1A6B5A' : '#f3f4f6',
                  color: i <= step ? 'white' : '#9ca3af',
                }}
              >
                {i < step ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span className="text-xs text-gray-500 mt-1 whitespace-nowrap hidden sm:block">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mt-0 sm:-mt-5 transition-all" style={{ backgroundColor: i < step ? '#1A6B5A' : '#e5e7eb' }} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">

          {/* Step 0 — Type & operation */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Home size={13} />Operación</label>
                <div className="flex gap-2">
                  {(['venta', 'alquiler'] as const).map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setValue('operation', op)}
                      className={cn('flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all', operation === op ? 'text-white border-transparent' : 'text-gray-600 border-gray-200 hover:border-gray-300')}
                      style={operation === op ? { backgroundColor: '#1A6B5A' } : undefined}
                    >
                      {OPERATION_TYPE_LABELS[op]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Tipo de propiedad</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setValue('type', t)}
                      className={cn('py-2 rounded-xl text-xs font-medium border transition-all', type === t ? 'text-white border-transparent' : 'text-gray-600 border-gray-200 hover:border-gray-300')}
                      style={type === t ? { backgroundColor: '#1A6B5A' } : undefined}
                    >
                      {PROPERTY_TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Título del anuncio</label>
                <input {...register('title')} placeholder="Ej: Luminoso departamento en Palermo con terraza" className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-400', errors.title ? 'border-red-300' : 'border-gray-200')} />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
              </div>
            </div>
          )}

          {/* Step 1 — Location */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1 text-gray-600">
                <MapPin size={14} />
                <span className="text-sm font-semibold">Ubicación</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Ciudad</label>
                <select {...register('city')} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white">
                  {ARGENTINIAN_CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Barrio / Zona</label>
                <input {...register('neighborhood')} placeholder="Ej: Palermo, Belgrano..." className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-400', errors.neighborhood ? 'border-red-300' : 'border-gray-200')} />
                {errors.neighborhood && <p className="mt-1 text-xs text-red-600">{errors.neighborhood.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Dirección (opcional)</label>
                <input {...register('address')} placeholder="Ej: Av. Santa Fe 2450" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400" />
              </div>
            </div>
          )}

          {/* Step 2 — Features */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Superficie (m²)</label>
                  <input type="number" {...register('surface', { valueAsNumber: true })} className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-400', errors.surface ? 'border-red-300' : 'border-gray-200')} />
                  {errors.surface && <p className="mt-1 text-xs text-red-600">{errors.surface.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Ambientes</label>
                  <input type="number" {...register('rooms', { valueAsNumber: true })} min={0} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Baños</label>
                  <input type="number" {...register('bathrooms', { valueAsNumber: true })} min={0} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Comodidades</label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_FEATURES.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFeature(f)}
                      className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all', features.includes(f) ? 'text-white border-transparent' : 'text-gray-600 border-gray-200 hover:border-gray-300')}
                      style={features.includes(f) ? { backgroundColor: '#1A6B5A' } : undefined}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Price & photos */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1 text-gray-600">
                <DollarSign size={14} />
                <span className="text-sm font-semibold">Precio</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Moneda</label>
                  <select {...register('currency')} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white">
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Precio ({currency})</label>
                  <input type="number" {...register('price', { valueAsNumber: true })} className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-400', errors.price ? 'border-red-300' : 'border-gray-200')} />
                  {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Descripción</label>
                <textarea {...register('description')} rows={4} placeholder="Describí la propiedad: orientación, estado, extras..." className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-400 resize-none', errors.description ? 'border-red-300' : 'border-gray-200')} />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1"><Camera size={12} />Fotos</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 transition-colors cursor-pointer">
                  <Camera size={24} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400 font-medium">Arrastrá fotos o hacé clic para subir</p>
                  <p className="text-xs text-gray-300 mt-1">JPG, PNG — máx. 10 MB por imagen</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-all"
          >
            <ChevronLeft size={16} /> Anterior
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
              style={{ backgroundColor: '#1A6B5A' }}
            >
              Siguiente <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all"
              style={{ backgroundColor: '#1A6B5A' }}
            >
              {submitting ? <><Loader2 size={14} className="animate-spin" />Publicando...</> : <><CheckCircle2 size={14} />Publicar propiedad</>}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
