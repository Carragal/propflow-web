import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, ApiError } from '@/lib/api'

export type BackendRole = 'USER' | 'AGENT' | 'AGENCY_ADMIN' | 'SUPER_ADMIN'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: BackendRole
  avatar?: string
  phone?: string
  tenantId: string
  agencyId?: string | null
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string; role: string }) => Promise<void>
  logout: () => void
  clearError: () => void
  refreshToken: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post<{ user: AuthUser; accessToken: string; refreshToken: string }>(
            '/auth/login',
            { email, password },
          )
          set({ user: res.user, accessToken: res.accessToken, isLoading: false })
        } catch (err) {
          const message =
            err instanceof ApiError ? err.message : 'Error al iniciar sesión'
          set({ isLoading: false, error: message })
        }
      },

      register: async ({ name, email, password, role }) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post<{ user: AuthUser; accessToken: string; refreshToken: string }>(
            '/auth/register',
            { name, email, password, role },
          )
          set({ user: res.user, accessToken: res.accessToken, isLoading: false })
        } catch (err) {
          const message =
            err instanceof ApiError ? err.message : 'Error al registrarse'
          set({ isLoading: false, error: message })
        }
      },

      logout: () => set({ user: null, accessToken: null, error: null }),

      clearError: () => set({ error: null }),

      refreshToken: async () => {
        try {
          const res = await api.post<{ user: AuthUser; accessToken: string; refreshToken: string }>(
            '/auth/refresh',
            {},
          )
          set({ user: res.user, accessToken: res.accessToken })
        } catch {
          set({ user: null, accessToken: null })
        }
      },
    }),
    {
      name: 'casaai-auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    },
  ),
)

/** Helper para saber si el usuario puede gestionar propiedades */
export function canManageProperties(role?: BackendRole) {
  return role === 'AGENT' || role === 'AGENCY_ADMIN' || role === 'SUPER_ADMIN'
}

/** Helper para redirigir según rol después del login */
export function getDashboardPath(role?: BackendRole) {
  if (role === 'AGENCY_ADMIN' || role === 'AGENT') return '/inmobiliaria'
  if (role === 'SUPER_ADMIN') return '/admin'
  return '/usuario'
}
