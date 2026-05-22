'use client'

import { useState } from 'react'
import { TrendingUp, DollarSign, Percent, Calculator, Building2, Sparkles, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const PROPERTY_TYPES = ['Departamento', 'Casa', 'Local comercial', 'Oficina']
const CITIES = ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Mar del Plata']

const RENTAL_YIELDS: Record<string, number> = {
  'Buenos Aires': 4.2,
  'Córdoba': 5.1,
  'Rosario': 4.8,
  'Mendoza': 5.5,
  'Mar del Plata': 6.1,
}

const APPRECIATION: Record<string, number> = {
  'Buenos Aires': 3.8,
  'Córdoba': 4.2,
  'Rosario': 3.5,
  'Mendoza': 4.9,
  'Mar del Plata': 5.2,
}

function formatUSD(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function InversionPage() {
  const [price, setPrice] = useState(120000)
  const [city, setCity] = useState('Buenos Aires')
  const [years, setYears] = useState(10)
  const [expenses, setExpenses] = useState(20)

  const yieldPct = RENTAL_YIELDS[city]
  const appreciationPct = APPRECIATION[city]

  const grossMonthlyRent = (price * (yieldPct / 100)) / 12
  const netMonthlyRent = grossMonthlyRent * (1 - expenses / 100)
  const netAnnualRent = netMonthlyRent * 12
  const futureValue = price * Math.pow(1 + appreciationPct / 100, years)
  const totalRentCollected = netAnnualRent * years
  const totalReturn = futureValue + totalRentCollected - price
  const totalReturnPct = (totalReturn / price) * 100
  const annualizedReturn = (Math.pow((futureValue + totalRentCollected) / price, 1 / years) - 1) * 100

  const BENEFITS = [
    { icon: TrendingUp, title: 'Revalorización histórica', desc: 'Las propiedades en Argentina han demostrado ser reserva de valor en dólares a largo plazo.' },
    { icon: DollarSign, title: 'Renta en dólares', desc: 'Los alquileres en zonas premium se pactan en USD, protegiendo tu capital de la inflación.' },
    { icon: Building2, title: 'Activo tangible', desc: 'A diferencia de acciones o criptomonedas, la propiedad es un activo físico con valor intrínseco.' },
    { icon: Percent, title: 'Apalancamiento financiero', desc: 'Con créditos hipotecarios podés multiplicar tu retorno usando capital ajeno.' },
  ]

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="pt-24 pb-16" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 60%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: '#edf7f5', color: '#1A6B5A' }}>
              <Sparkles size={13} /> Análisis con IA
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Invertí en propiedades con inteligencia
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Calculá tu retorno esperado, comparé ciudades y tomá decisiones basadas en datos reales de mercado.
            </p>
            <Link href="/propiedades?operacion=venta" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: '#1A6B5A' }}>
              Ver propiedades de inversión <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Calculadora de retorno
          </h2>
          <p className="text-gray-500">Ajustá los parámetros y mirá cómo cambia tu inversión.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><Calculator size={16} className="text-gray-400" />Parámetros</h3>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Precio de compra</label>
                    <span className="text-sm font-bold" style={{ color: '#1A6B5A' }}>{formatUSD(price)}</span>
                  </div>
                  <input type="range" min={30000} max={500000} step={5000} value={price} onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full accent-emerald-700" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>USD 30k</span><span>USD 500k</span></div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Ciudad</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white">
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Horizonte de inversión</label>
                    <span className="text-sm font-bold" style={{ color: '#1A6B5A' }}>{years} años</span>
                  </div>
                  <input type="range" min={1} max={30} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full accent-emerald-700" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 año</span><span>30 años</span></div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Gastos operativos</label>
                    <span className="text-sm font-bold" style={{ color: '#1A6B5A' }}>{expenses}%</span>
                  </div>
                  <input type="range" min={0} max={40} step={5} value={expenses} onChange={(e) => setExpenses(Number(e.target.value))}
                    className="w-full accent-emerald-700" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0%</span><span>40%</span></div>
                </div>

                <div className="pt-2 border-t border-gray-50 space-y-1.5 text-xs text-gray-400">
                  <p>Rendimiento bruto en {city}: <strong className="text-gray-600">{yieldPct}% anual</strong></p>
                  <p>Revalorización histórica: <strong className="text-gray-600">{appreciationPct}% anual</strong></p>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {/* Main return card */}
            <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1A6B5A, #104538)' }}>
              <p className="text-emerald-200 text-sm mb-1">Retorno total proyectado a {years} años</p>
              <p className="text-4xl font-bold mb-1">{formatUSD(totalReturn)}</p>
              <p className="text-emerald-200 text-sm">+{totalReturnPct.toFixed(1)}% sobre la inversión inicial</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-500 mb-1">Renta mensual neta</p>
                <p className="text-2xl font-bold text-gray-900">{formatUSD(netMonthlyRent)}</p>
                <p className="text-xs text-gray-400 mt-1">{formatUSD(netAnnualRent)}/año</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-500 mb-1">Valor futuro estimado</p>
                <p className="text-2xl font-bold text-gray-900">{formatUSD(futureValue)}</p>
                <p className="text-xs text-gray-400 mt-1">+{((futureValue / price - 1) * 100).toFixed(0)}% revalorización</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-500 mb-1">Renta total cobrada</p>
                <p className="text-2xl font-bold text-gray-900">{formatUSD(totalRentCollected)}</p>
                <p className="text-xs text-gray-400 mt-1">en {years} años</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-500 mb-1">Retorno anualizado</p>
                <p className="text-2xl font-bold" style={{ color: '#1A6B5A' }}>{annualizedReturn.toFixed(1)}%</p>
                <p className="text-xs text-gray-400 mt-1">TIR estimada</p>
              </div>
            </div>

            {/* Visual bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-700 mb-3">Composición del retorno</p>
              <div className="flex rounded-full overflow-hidden h-4 mb-2">
                <div className="transition-all" style={{ width: `${(totalRentCollected / totalReturn) * 100}%`, backgroundColor: '#1A6B5A' }} title="Renta" />
                <div className="transition-all" style={{ width: `${((futureValue - price) / totalReturn) * 100}%`, backgroundColor: '#86efac' }} title="Revalorización" />
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#1A6B5A' }} />Renta ({((totalRentCollected / totalReturn) * 100).toFixed(0)}%)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block bg-green-300" />Revalorización ({(((futureValue - price) / totalReturn) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              ¿Por qué invertir en propiedades?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#edf7f5' }}>
                  <Icon size={18} style={{ color: '#1A6B5A' }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Encontrá tu próxima inversión
        </h2>
        <p className="text-gray-500 mb-6">Explorá propiedades filtradas por rendimiento y zona.</p>
        <Link href="/propiedades?operacion=venta" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: '#1A6B5A' }}>
          Ver propiedades <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  )
}
