import Link from 'next/link'
import {
  Brain,
  TrendingUp,
  Sparkles,
  BarChart3,
  Building2,
  ArrowRight,
  CheckCircle2,
  Star,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyGrid from '@/components/properties/PropertyGrid'
import SearchBar from '@/components/search/SearchBar'
import { mockProperties } from '@/lib/mockData'

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-brand-900">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: '#1A6B5A' }}
      />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-10 bg-emerald-400" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
          <Sparkles size={12} className="text-emerald-400" />
          Match inteligente · Tasador IA · Tours 360°
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif', letterSpacing: '-0.03em' }}
        >
          Encontrá tu próxima
          <br />
          <span style={{ color: '#42b7a3' }}>propiedad ideal</span>
        </h1>

        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          La plataforma inmobiliaria más inteligente de Argentina. Usamos IA para conectarte con
          las propiedades que realmente se adaptan a vos.
        </p>

        <div className="max-w-3xl mx-auto">
          <SearchBar />
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-14">
          {[
            { value: '+12.000', label: 'propiedades activas' },
            { value: '94%', label: 'de satisfacción' },
            { value: '+500', label: 'inmobiliarias' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p
                className="text-3xl font-bold text-white"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                {value}
              </p>
              <p className="text-gray-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}

function FeaturedPropertiesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#1A6B5A' }}>
            Destacadas
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Propiedades seleccionadas
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            Elegidas por nuestro algoritmo de match para el perfil promedio.
          </p>
        </div>
        <Link
          href="/propiedades"
          className="flex items-center gap-2 text-sm font-semibold transition-colors whitespace-nowrap group"
          style={{ color: '#1A6B5A' }}
        >
          Ver todas
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <PropertyGrid properties={mockProperties} />
    </section>
  )
}

const AI_FEATURES = [
  {
    icon: Brain,
    title: 'Match inteligente',
    description:
      'Nuestro algoritmo aprende de tus preferencias y comportamiento para sugerirte propiedades con un score de compatibilidad personalizado.',
  },
  {
    icon: BarChart3,
    title: 'Tasador IA',
    description:
      'Estimá el valor de mercado de cualquier propiedad al instante. Modelos de valuación entrenados con cientos de miles de transacciones argentinas.',
  },
  {
    icon: Sparkles,
    title: 'Análisis automático',
    description:
      'Reportes de comparables, histórico de precios por barrio y proyecciones en segundos. Lo que antes llevaba días, hoy es inmediato.',
  },
]

function AISection() {
  return (
    <section className="bg-gradient-to-br from-gray-950 to-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border"
              style={{ backgroundColor: '#1A6B5A1a', color: '#42b7a3', borderColor: '#1A6B5A33' }}
            >
              <Sparkles size={12} />
              Inteligencia artificial
            </div>
            <h2
              className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              La IA que trabaja
              <br />
              para vos
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              CasaAI combina datos de mercado en tiempo real, comportamiento del usuario y
              modelos de machine learning para transformar cómo se busca, compra y vende
              inmuebles en Argentina.
            </p>
            <ul className="space-y-3">
              {[
                'Score de match personalizado en cada propiedad',
                'Valuaciones automáticas con margen < 3%',
                'Alertas inteligentes cuando bajan precios en tu zona',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={16} style={{ color: '#42b7a3' }} className="flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg group"
              style={{ backgroundColor: '#1A6B5A' }}
            >
              Conocer más
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid gap-4">
            {AI_FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="border rounded-2xl p-6 hover:bg-white/5 transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#1A6B5A33' }}
                >
                  <Icon size={20} style={{ color: '#42b7a3' }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const INVESTMENT_FEATURES = [
  {
    icon: TrendingUp,
    title: 'ROI estimado',
    description: 'Calculá el retorno de inversión esperado de cualquier propiedad en segundos.',
  },
  {
    icon: BarChart3,
    title: 'Análisis financiero',
    description: 'Proyecciones de flujo de caja, rentabilidad de alquiler y valorización histórica.',
  },
  {
    icon: Building2,
    title: 'Comparación de zonas',
    description: 'Compará el rendimiento por barrio, ciudad o tipo de propiedad.',
  },
]

function InvestmentSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-14">
        <p
          className="text-sm font-semibold uppercase tracking-widest mb-2"
          style={{ color: '#1A6B5A' }}
        >
          Para inversores
        </p>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Tomá decisiones basadas en datos
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Dejá de adivinar. Nuestro módulo de análisis de inversión te muestra los números
          reales detrás de cada operación.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {INVESTMENT_FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group p-8 rounded-2xl border border-gray-100 hover:border-green-100 hover:shadow-lg transition-all"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
              style={{ backgroundColor: '#edf7f5' }}
            >
              <Icon size={22} style={{ color: '#1A6B5A' }} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 border"
        style={{ background: 'linear-gradient(to right, #edf7f5, #ecfdf5)', borderColor: '#d0ede8' }}
      >
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            ¿Cuánto rinde tu próxima inversión?
          </h3>
          <p className="text-gray-600">
            Analizá cualquier propiedad con nuestro calculador de inversión gratuito.
          </p>
        </div>
        <Link
          href="/inversion"
          className="flex-shrink-0 px-7 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg whitespace-nowrap"
          style={{ backgroundColor: '#1A6B5A' }}
        >
          Analizar inversión →
        </Link>
      </div>
    </section>
  )
}

function FinalCTASection() {
  return (
    <section className="bg-gray-50 border-t border-gray-100 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
          ))}
        </div>
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Publicá tu propiedad
          <br />
          <span style={{ color: '#1A6B5A' }}>y llegá a miles de compradores</span>
        </h2>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Más de 12.000 propiedades publicadas. Sumate a la comunidad de propietarios e
          inmobiliarias que ya usan CasaAI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/registro"
            className="px-8 py-4 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:shadow-xl"
            style={{ backgroundColor: '#1A6B5A' }}
          >
            Publicar mi propiedad
          </Link>
          <Link
            href="/propiedades"
            className="px-8 py-4 rounded-xl text-gray-800 font-semibold text-base border border-gray-200 hover:border-gray-300 hover:bg-white transition-all"
          >
            Ver propiedades
          </Link>
        </div>
        <p className="text-gray-400 text-sm mt-6">
          Primera publicación gratis · Sin comisión oculta · Soporte 24/7
        </p>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedPropertiesSection />
        <AISection />
        <InvestmentSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  )
}
