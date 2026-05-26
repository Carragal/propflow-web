'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Tenant } from '@/types/tenant'
import { DEFAULT_TENANT } from '@/lib/constants'
import { useAuthStore } from '@/store/useAuthStore'

interface NavbarProps {
  tenant?: Tenant
}

const NAV_LINKS = [
  { label: 'Propiedades', href: '/propiedades' },
  { label: 'Inversión', href: '/inversion' },
  { label: 'Servicios', href: '/servicios' },
]

export default function Navbar({ tenant = DEFAULT_TENANT }: NavbarProps) {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const dashboardHref =
    user?.role === 'AGENCY_ADMIN' || user?.role === 'AGENT' ? '/inmobiliaria' : '/usuario'

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    router.push('/')
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105"
              style={{ backgroundColor: tenant.primaryColor }}
            >
              CA
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                color: isScrolled ? '#1a1a1a' : 'inherit',
              }}
            >
              {tenant.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isScrolled
                    ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-gray-800 hover:text-gray-900 hover:bg-white/20'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-all bg-white"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: tenant.primaryColor }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800 max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-xl py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard size={15} className="text-gray-400" />
                      Mi panel
                    </Link>
                    <Link
                      href="/usuario/perfil"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={15} className="text-gray-400" />
                      Mi perfil
                    </Link>
                    {user.role === 'USER' && (
                      <Link
                        href="/usuario/alertas"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Bell size={15} className="text-gray-400" />
                        Mis alertas
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-gray-800 hover:text-gray-900'
                  )}
                >
                  Ingresar
                </Link>
                <Link
                  href="/registro"
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 hover:shadow-md active:scale-95"
                  style={{ backgroundColor: tenant.primaryColor }}
                >
                  Publicar propiedad
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Menú"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-center"
                onClick={() => setIsMobileOpen(false)}
              >
                Ingresar
              </Link>
              <Link
                href="/registro"
                className="px-4 py-3 text-sm font-medium text-white rounded-lg text-center"
                style={{ backgroundColor: tenant.primaryColor }}
                onClick={() => setIsMobileOpen(false)}
              >
                Publicar propiedad
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
