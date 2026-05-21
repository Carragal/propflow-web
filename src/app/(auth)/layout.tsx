import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-10 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105"
              style={{ backgroundColor: '#1A6B5A' }}
            >
              CA
            </div>
            <span
              className="text-lg font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              CasaAI
            </span>
          </Link>
          {children}
        </div>
      </div>

      {/* Brand side */}
      <div className="hidden lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950" />
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"
          alt="Propiedad premium"
          fill
          className="object-cover opacity-20"
          sizes="50vw"
        />
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-14">
          <blockquote className="mb-10">
            <p
              className="text-white text-2xl font-bold leading-snug mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              "Encontré el departamento perfecto en 3 días gracias al match de CasaAI."
            </p>
            <footer className="text-emerald-400 text-sm font-medium">
              — Martina R., compradora en Palermo
            </footer>
          </blockquote>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
            {[
              { value: '+12.000', label: 'propiedades' },
              { value: '94%', label: 'satisfacción' },
              { value: '+500', label: 'inmobiliarias' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  {value}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
