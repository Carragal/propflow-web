'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2, Home, Maximize2, BedDouble, MapPin } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { ARGENTINIAN_CITIES, PROPERTY_TYPE_LABELS } from '@/lib/constants'
import { useState } from 'react'

const profileSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  phone: z.string().optional(),
})

type ProfileInput = z.infer<typeof profileSchema>

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string | null
  avatar?: string | null
}

const PREFERENCE_TYPES = ['departamento', 'casa', 'terreno', 'local', 'oficina'] as const
const ROOM_OPTIONS = [1, 2, 3, 4, 5]
const BUDGET_OPTIONS = [
  'Hasta USD 80.000',
  'USD 80.000 – 150.000',
  'USD 150.000 – 300.000',
  'Más de USD 300.000',
]

export default function PerfilPage() {
  const { user, updateUser } = useAuthStore()
  const queryClient = useQueryClient()
  const [prefTypes, setPrefTypes] = useState<string[]>(['departamento'])
  const [prefRooms, setPrefRooms] = useState<number>(2)
  const [prefCity, setPrefCity] = useState('Buenos Aires')
  const [prefBudget, setPrefBudget] = useState(BUDGET_OPTIONS[1])

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['user-profile', user?.id],
    queryFn: () => api.get<UserProfile>(`/users/${user!.id}`),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', phone: '' },
  })

  useEffect(() => {
    if (profile) {
      reset({ name: profile.name, phone: profile.phone ?? '' })
    }
  }, [profile, reset])

  const updateMutation = useMutation({
    mutationFn: (data: ProfileInput) => api.patch<UserProfile>(`/users/${user!.id}`, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['user-profile', user?.id], updated)
      updateUser({ name: updated.name, phone: updated.phone ?? undefined })
    },
  })

  const onSubmit = (data: ProfileInput) => updateMutation.mutate(data)

  const completionItems = [
    { label: 'Datos personales', done: !!profile?.name },
    { label: 'Tipo de propiedad preferida', done: prefTypes.length > 0 },
    { label: 'Ciudad de interés', done: !!prefCity },
    { label: 'Presupuesto', done: !!prefBudget },
    { label: 'Teléfono', done: !!profile?.phone },
  ]
  const completionPct = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100)

  const toggleType = (type: string) =>
    setPrefTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type])

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-1">Mi cuenta</p>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Mi perfil
        </h1>
      </div>

      {/* Completion bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-800">Completitud del perfil</p>
          <span className="text-sm font-bold" style={{ color: '#1A6B5A' }}>{completionPct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div className="h-2 rounded-full transition-all" style={{ width: `${completionPct}%`, backgroundColor: '#1A6B5A' }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {completionItems.map(({ label, done }) => (
            <div key={label} className={`flex items-center gap-2 text-xs ${done ? 'text-gray-600' : 'text-gray-400'}`}>
              <CheckCircle2 size={13} style={{ color: done ? '#1A6B5A' : '#d1d5db' }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal data */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Datos personales</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre completo</label>
                <input
                  {...register('name')}
                  className={cn('w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-400', errors.name ? 'border-red-300' : 'border-gray-200')}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                <input
                  value={profile?.email ?? user?.email ?? ''}
                  disabled
                  className="w-full px-3 py-2.5 text-sm border border-gray-100 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Teléfono (opcional)</label>
                <input
                  {...register('phone')}
                  placeholder="+54 11 0000-0000"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all"
                style={{ backgroundColor: '#1A6B5A' }}
              >
                {updateMutation.isPending
                  ? <><Loader2 size={14} className="animate-spin" />Guardando...</>
                  : 'Guardar cambios'}
              </button>
              {updateMutation.isSuccess && (
                <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#1A6B5A' }}>
                  <CheckCircle2 size={15} />¡Guardado!
                </span>
              )}
              {updateMutation.isError && (
                <span className="text-sm text-red-600">Error al guardar. Intentá de nuevo.</span>
              )}
            </div>
          </form>
        </div>

        {/* Search preferences */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-bold text-gray-900">Preferencias de búsqueda</h2>
            <span className="text-xs text-white px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#1A6B5A' }}>IA</span>
          </div>
          <p className="text-xs text-gray-400 mb-5">Estos datos mejoran tu score de match en las propiedades.</p>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Home size={13} />Tipo de propiedad</label>
              <div className="flex flex-wrap gap-2">
                {PREFERENCE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all', prefTypes.includes(type) ? 'text-white border-transparent' : 'text-gray-600 border-gray-200 hover:border-gray-300')}
                    style={prefTypes.includes(type) ? { backgroundColor: '#1A6B5A' } : undefined}
                  >
                    {PROPERTY_TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><BedDouble size={13} />Ambientes mínimos</label>
              <div className="flex gap-2">
                {ROOM_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setPrefRooms(n)}
                    className={cn('w-10 h-10 rounded-lg text-sm font-semibold border transition-all', prefRooms === n ? 'text-white border-transparent' : 'text-gray-600 border-gray-200 hover:border-gray-300')}
                    style={prefRooms === n ? { backgroundColor: '#1A6B5A' } : undefined}
                  >
                    {n === 5 ? '5+' : n}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><MapPin size={13} />Ciudad de interés</label>
                <select value={prefCity} onChange={(e) => setPrefCity(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white">
                  {ARGENTINIAN_CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Maximize2 size={13} />Presupuesto</label>
                <select value={prefBudget} onChange={(e) => setPrefBudget(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white">
                  {BUDGET_OPTIONS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
