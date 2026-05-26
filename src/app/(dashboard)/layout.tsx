'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Heart, Search, Bell, User, LogOut, Home,
  LayoutDashboard, Building2, BarChart3, PlusCircle, MessageSquare, Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'

const BUYER_NAV = [
  { label: 'Inicio', href: '/usuario', icon: LayoutDashboard },
  { label: 'Guardadas', href: '/usuario/guardadas', icon: Heart },
  { label: 'Búsquedas', href: '/usuario/busquedas', icon: Search },
  { label: 'Alertas', href: '/usuario/alertas', icon: Bell },
  { label: 'Mi perfil', href: '/usuario/perfil', icon: User },
]

const AGENCY_NAV = [
  { label: 'Resumen', href: '/inmobiliaria', icon: LayoutDashboard },
  { label: 'Propiedades', href: '/inmobiliaria/propiedades', icon: Building2 },
  { label: 'Publicar', href: '/inmobiliaria/publicar', icon: PlusCircle },
  { label: 'Consultas', href: '/inmobiliaria/consultas', icon: MessageSquare },
  { label: 'Estadísticas', href: '/inmobiliaria/estadisticas', icon: BarChart3 },
  { label: 'Configuración', href: '/inmobiliaria/config', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const isAgency = user?.role === 'AGENCY_ADMIN' || user?.role === 'AGENT'
  const nav = isAgency ? AGENCY_NAV : BUYER_NAV

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col fixed top-0 bottom-0 left-0 z-30">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: '#1A6B5A' }}
            >
              CA
            </div>
            <span
              className="font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              CasaAI
            </span>
          </Link>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: '#1A6B5A' }}
            >
              {user?.name.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name ?? '—'}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
                style={active ? { backgroundColor: '#1A6B5A' } : undefined}
              >
                <Icon size={17} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
          >
            <Home size={17} />
            Volver al sitio
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  )
}
