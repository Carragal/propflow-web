'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore, getDashboardPath, type AuthUser } from '@/store/useAuthStore'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      router.replace('/login?error=oauth_failed')
      return
    }

    // Guarda el token y obtiene el perfil
    useAuthStore.setState({ accessToken: token })
    api
      .get<AuthUser>('/auth/me')
      .then((user) => {
        useAuthStore.setState({ user })
        router.replace(getDashboardPath(user.role))
      })
      .catch(() => {
        useAuthStore.setState({ accessToken: null })
        router.replace('/login?error=oauth_failed')
      })
  }, [router, searchParams])

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 size={32} className="animate-spin" style={{ color: '#1A6B5A' }} />
      <p className="text-sm text-gray-500">Iniciando sesión con Google…</p>
    </div>
  )
}
