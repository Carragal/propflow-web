'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, AlertCircle, Loader2, Home, Building2, CheckCircle2 } from 'lucide-react'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'

type Role = 'comprador' | 'inmobiliaria'

const ROLES: { value: Role; label: string; description: string; icon: typeof Home }[] = [
  {
    value: 'comprador',
    label: 'Comprador / Inquilino',
    description: 'Buscás propiedades para comprar o alquilar',
    icon: Home,
  },
  {
    value: 'inmobiliaria',
    label: 'Inmobiliaria / Propietario',
    description: 'Publicás y gestionás propiedades',
    icon: Building2,
  },
]

export default function RegistroPage() {
  const router = useRouter()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'comprador' },
  })

  const selectedRole = watch('role')
  const password = watch('password') ?? ''

  const passwordStrength = (() => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  })()

  const strengthLabel = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'][passwordStrength]
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#1A6B5A'][passwordStrength]

  const onSubmit = async (data: RegisterInput) => {
    clearError()
    await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    })
    const state = useAuthStore.getState()
    if (state.user) {
      router.push(state.user.role === 'inmobiliaria' ? '/inmobiliaria' : '/usuario')
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Creá tu cuenta
        </h1>
        <p className="text-gray-500 text-sm">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: '#1A6B5A' }}>
            Ingresá acá
          </Link>
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Role selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Soy...</label>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map(({ value, label, description, icon: Icon }) => {
              const active = selectedRole === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('role', value, { shouldValidate: true })}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all',
                    active
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  )}
                  style={active ? { borderColor: '#1A6B5A', backgroundColor: '#edf7f5' } : undefined}
                >
                  <Icon
                    size={20}
                    className="mb-2"
                    style={{ color: active ? '#1A6B5A' : '#9ca3af' }}
                  />
                  <p className={cn('text-xs font-semibold', active ? 'text-gray-900' : 'text-gray-700')}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{description}</p>
                </button>
              )
            })}
          </div>
          {errors.role && (
            <p className="mt-1.5 text-xs text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {selectedRole === 'inmobiliaria' ? 'Nombre de la inmobiliaria' : 'Nombre completo'}
          </label>
          <input
            type="text"
            autoComplete="name"
            placeholder={selectedRole === 'inmobiliaria' ? 'Ej: Reinvent Inmobiliaria' : 'Ej: Martina García'}
            {...register('name')}
            className={cn(
              'w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2',
              errors.name
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 focus:border-emerald-400 focus:ring-emerald-50'
            )}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            autoComplete="email"
            placeholder="vos@ejemplo.com"
            {...register('email')}
            className={cn(
              'w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2',
              errors.email
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 focus:border-emerald-400 focus:ring-emerald-50'
            )}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              {...register('password')}
              className={cn(
                'w-full px-4 py-3 pr-11 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2',
                errors.password
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-gray-200 focus:border-emerald-400 focus:ring-emerald-50'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all"
                    style={{
                      backgroundColor: i <= passwordStrength ? strengthColor : '#e5e7eb',
                    }}
                  />
                ))}
              </div>
              {strengthLabel && (
                <p className="text-xs" style={{ color: strengthColor }}>
                  Contraseña {strengthLabel}
                </p>
              )}
            </div>
          )}
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirmá tu contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Repetí tu contraseña"
              {...register('confirmPassword')}
              className={cn(
                'w-full px-4 py-3 pr-11 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2',
                errors.confirmPassword
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-gray-200 focus:border-emerald-400 focus:ring-emerald-50'
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            {...register('terms')}
            className="w-4 h-4 mt-0.5 rounded border-gray-300 flex-shrink-0"
            style={{ accentColor: '#1A6B5A' }}
          />
          <span className="text-sm text-gray-600 leading-snug">
            Acepto los{' '}
            <Link href="#" className="underline hover:text-gray-900">
              términos y condiciones
            </Link>{' '}
            y la{' '}
            <Link href="#" className="underline hover:text-gray-900">
              política de privacidad
            </Link>
          </span>
        </label>
        {errors.terms && (
          <p className="-mt-3 text-xs text-red-600">{errors.terms.message}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#1A6B5A' }}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creando cuenta...
            </>
          ) : (
            'Crear cuenta gratis'
          )}
        </button>
      </form>
    </>
  )
}
