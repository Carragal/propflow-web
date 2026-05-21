import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'comprador' | 'inmobiliaria' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string; role: UserRole }) => Promise<void>
  logout: () => void
  clearError: () => void
}

// Mock users for development
const MOCK_USERS: AuthUser[] = [
  { id: '1', name: 'Juan García', email: 'juan@casaai.com', role: 'comprador' },
  { id: '2', name: 'Inmobiliaria Centro', email: 'admin@reinvent.com', role: 'inmobiliaria' },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        // TODO: replace with real API call
        await new Promise((r) => setTimeout(r, 900))

        const found = MOCK_USERS.find((u) => u.email === email)
        if (!found || password.length < 6) {
          set({ isLoading: false, error: 'Email o contraseña incorrectos.' })
          return
        }
        set({ user: found, isLoading: false })
      },

      register: async ({ name, email, password: _password, role }) => {
        set({ isLoading: true, error: null })
        // TODO: replace with real API call
        await new Promise((r) => setTimeout(r, 1000))

        const exists = MOCK_USERS.find((u) => u.email === email)
        if (exists) {
          set({ isLoading: false, error: 'Ya existe una cuenta con ese email.' })
          return
        }

        const newUser: AuthUser = {
          id: String(Date.now()),
          name,
          email,
          role,
        }
        set({ user: newUser, isLoading: false })
      },

      logout: () => set({ user: null, error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'casaai-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
