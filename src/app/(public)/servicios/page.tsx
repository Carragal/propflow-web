import Link from 'next/link'
import { Sparkles, Search, Bell, Building2, BarChart3, Shield, MessageSquare, ChevronRight, CheckCircle2 } from 'lucide-react'

const SERVICES = [
  {
    icon: Sparkles,
    title: 'Match IA',
    tag: 'IA',
    description: 'Nuestro algoritmo analiza tus preferencias y te muestra propiedades con un score de compatibilidad personalizado. Cuanto más completo esté tu perfil, mejores resultados.',
    features: ['Score de match del 0 al 100', 'Aprende de tus búsquedas', 'Notificaciones de nuevas coincidencias', 'Disponible para compradores e inquilinos'],
    href: '/usuario/perfil',
    cta: 'Configurar mi perfil',
    highlight: true,
  },
  {
    icon: Search,
    title: 'Búsqueda avanzada',
    tag: null,
    description: 'Filtrá por operación, tipo, precio, superficie, ambientes, barrio y comodidades. Guardá tus búsquedas para retomar donde las dejaste.',
    features: ['Filtros combinables', 'Vista grilla o mapa interactivo', 'Ordenamiento múltiple', 'Búsquedas guardadas'],
    href: '/propiedades',
    cta: 'Explorar propiedades',
    highlight: false,
  },
  {
    icon: Bell,
    title: 'Alertas de precio',
    tag: null,
    description: 'Configurá alertas por zona, tipo y presupuesto. Te avisamos al instante cuando aparezca una propiedad que coincida con lo que buscás.',
    features: ['Alertas en tiempo real', 'Filtros por precio máximo', 'Activar / pausar fácilmente', 'Sin límite de alertas'],
    href: '/usuario/alertas',
    cta: 'Crear una alerta',
    highlight: false,
  },
  {
    icon: Building2,
    title: 'Panel inmobiliaria',
    tag: 'Pro',
    description: 'Publicá y gestioná tus propiedades desde un panel profesional. Respondé consultas, analizá estadísticas y optimizá tus publicaciones.',
    features: ['Publicación ilimitada', 'Gestión de consultas', 'Estadísticas de rendimiento', 'Wizard de publicación guiado'],
    href: '/registro',
    cta: 'Registrar mi inmobiliaria',
    highlight: false,
  },
  {
    icon: BarChart3,
    title: 'Análisis de inversión',
    tag: 'IA',
    description: 'Calculá el retorno esperado de cualquier propiedad: renta mensual, revalorización histórica por ciudad y TIR proyectada a tu horizonte de inversión.',
    features: ['Calculadora de ROI interactiva', 'Datos por ciudad', 'Proyección a largo plazo', 'Composición del retorno'],
    href: '/inversion',
    cta: 'Calcular mi retorno',
    highlight: false,
  },
  {
    icon: Shield,
    title: 'Datos verificados',
    tag: null,
    description: 'Cada publicación pasa por un proceso de verificación. Fotos reales, precios actualizados y agentes certificados para que tu experiencia sea segura.',
    features: ['Agentes verificados', 'Fotos auditadas', 'Precios en tiempo real', 'Soporte ante inconvenientes'],
    href: '/contacto',
    cta: 'Hablar con soporte',
    highlight: false,
  },
]

const PLANS = [
  {
    name: 'Comprador',
    price: 'Gratis',
    period: null,
    desc: 'Para quienes buscan su propiedad ideal.',
    features: ['Búsqueda avanzada ilimitada', 'Match IA personalizado', 'Alertas de precio', 'Propiedades guardadas', 'Historial de búsquedas'],
    cta: 'Crear cuenta gratis',
    href: '/registro',
    highlight: false,
  },
  {
    name: 'Inmobiliaria',
    price: 'USD 49',
    period: '/mes',
    desc: 'Para agencias y propietarios que publican.',
    features: ['Todo lo de Comprador', 'Publicaciones ilimitadas', 'Panel de gestión completo', 'Estadísticas avanzadas', 'Bandeja de consultas', 'Soporte prioritario'],
    cta: 'Empezar prueba gratis',
    href: '/registro',
    highlight: true,
  },
]

export default function ServiciosPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="pt-24 pb-16" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 60%)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: '#edf7f5', color: '#1A6B5A' }}>
            <Sparkles size={13} /> Plataforma completa
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Todo lo que necesitás,<br />en un solo lugar
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            CasaAI combina búsqueda inteligente, datos de mercado y herramientas para inmobiliarias en una plataforma unificada.
          </p>
        </div>
      </div>

      {/* Services grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ icon: Icon, title, tag, description, features, href, cta, highlight }) => (
            <div
              key={title}
              className={`rounded-2xl p-6 border flex flex-col ${highlight ? 'border-transparent' : 'border-gray-100 bg-white'}`}
              style={highlight ? { background: 'linear-gradient(135deg, #1A6B5A, #104538)' } : undefined}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: highlight ? 'rgba(255,255,255,0.15)' : '#edf7f5' }}>
                  <Icon size={18} style={{ color: highlight ? 'white' : '#1A6B5A' }} />
                </div>
                {tag && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={highlight ? { backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' } : { backgroundColor: '#1A6B5A', color: 'white' }}
                  >
                    {tag}
                  </span>
                )}
              </div>
              <h3 className={`font-bold text-lg mb-2 ${highlight ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <p className={`text-sm leading-relaxed mb-4 flex-1 ${highlight ? 'text-emerald-100' : 'text-gray-500'}`}>{description}</p>
              <ul className="space-y-1.5 mb-5">
                {features.map((f) => (
                  <li key={f} className={`flex items-center gap-2 text-xs ${highlight ? 'text-emerald-100' : 'text-gray-500'}`}>
                    <CheckCircle2 size={12} style={{ color: highlight ? 'white' : '#1A6B5A', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={href}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={highlight ? { backgroundColor: 'white', color: '#1A6B5A' } : { backgroundColor: '#1A6B5A', color: 'white' }}
              >
                {cta} <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Planes y precios
            </h2>
            <p className="text-gray-500">Sin sorpresas. Empezá gratis y escalá cuando lo necesites.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {PLANS.map(({ name, price, period, desc, features, cta, href, highlight }) => (
              <div
                key={name}
                className={`rounded-2xl p-8 border ${highlight ? 'border-transparent' : 'border-gray-200 bg-white'}`}
                style={highlight ? { background: 'linear-gradient(135deg, #1A6B5A, #104538)' } : undefined}
              >
                <h3 className={`font-bold text-xl mb-1 ${highlight ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                <p className={`text-sm mb-4 ${highlight ? 'text-emerald-200' : 'text-gray-400'}`}>{desc}</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className={`text-4xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>{price}</span>
                  {period && <span className={`text-sm mb-1 ${highlight ? 'text-emerald-200' : 'text-gray-400'}`}>{period}</span>}
                </div>
                <ul className="space-y-2.5 mb-8">
                  {features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${highlight ? 'text-emerald-100' : 'text-gray-600'}`}>
                      <CheckCircle2 size={14} style={{ color: highlight ? 'white' : '#1A6B5A', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={href}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                  style={highlight ? { backgroundColor: 'white', color: '#1A6B5A' } : { backgroundColor: '#1A6B5A', color: 'white' }}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-16 text-center max-w-7xl mx-auto px-6">
        <MessageSquare size={32} className="mx-auto mb-4 text-gray-200" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          ¿Tenés dudas?
        </h2>
        <p className="text-gray-500 mb-6">Nuestro equipo está disponible para ayudarte.</p>
        <Link
          href="/contacto"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-all"
          style={{ backgroundColor: '#1A6B5A' }}
        >
          Contactar soporte <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  )
}
