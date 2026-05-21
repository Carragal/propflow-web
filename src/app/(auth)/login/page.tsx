'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    clearError()
    await login(data.email, data.password)
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
          Bienvenido de vuelta
        </h1>
        <p className="text-gray-500 text-sm">
          ¿No tenés cuenta?{' '}
          <Link href="/registro" className="font-semibold hover:underline" style={{ color: '#1A6B5A' }}>
            Registrate gratis
          </Link>
        </p>
      </div>

      {/* Error global */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
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
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-600">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
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
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Remember */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            {...register('remember')}
            className="w-4 h-4 rounded border-gray-300"
            style={{ accentColor: '#1A6B5A' }}
          />
          <span className="text-sm text-gray-600">Recordarme</span>
        </label>

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
              Ingresando...
            </>
          ) : (
            'Ingresar'
          )}
        </button>
      </form>

      {/* Demo hint */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-xs text-gray-500 font-medium mb-1">Credenciales de demo</p>
        <p className="text-xs text-gray-400">
          Comprador: <span className="font-mono text-gray-600">juan@casaai.com</span> / cualquier contraseña
        </p>
        <p className="text-xs text-gray-400">
          Inmobiliaria: <span className="font-mono text-gray-600">admin@reinvent.com</span> / cualquier contraseña
        </p>
      </div>
    </>
  )
}
