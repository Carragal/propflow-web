import Link from 'next/link'
import { Globe, Mail, MessageCircle, Share2 } from 'lucide-react'
import type { Tenant } from '@/types/tenant'
import { DEFAULT_TENANT } from '@/lib/constants'

interface FooterProps {
  tenant?: Tenant
}

const FOOTER_LINKS = {
  Plataforma: [
    { label: 'Propiedades', href: '/propiedades' },
    { label: 'Análisis de inversión', href: '/inversion' },
    { label: 'Tasador IA', href: '/servicios' },
    { label: 'Tours 360°', href: '/servicios' },
  ],
  Empresa: [
    { label: 'Sobre CasaAI', href: '#' },
    { label: 'Para inmobiliarias', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contacto', href: '/contacto' },
  ],
  Legal: [
    { label: 'Términos y condiciones', href: '#' },
    { label: 'Política de privacidad', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
}

const SOCIAL_LINKS = [
  { icon: MessageCircle, label: 'Instagram', href: '#' },
  { icon: Globe, label: 'Twitter / X', href: '#' },
  { icon: Share2, label: 'LinkedIn', href: '#' },
  { icon: Mail, label: 'Contacto', href: '/contacto' },
]

export default function Footer({ tenant = DEFAULT_TENANT }: FooterProps) {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: tenant.primaryColor }}
              >
                CA
              </div>
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                {tenant.name}
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              La plataforma inmobiliaria inteligente de Argentina. Encontrá tu propiedad ideal con
              el poder de la inteligencia artificial.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white text-sm font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} CasaAI. Todos los derechos reservados.
          </p>
          <p className="text-xs">
            Hecho en Argentina 🇦🇷 · Buenos Aires
          </p>
        </div>
      </div>
    </footer>
  )
}
