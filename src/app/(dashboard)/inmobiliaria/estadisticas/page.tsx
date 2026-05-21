'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Eye, MessageSquare, Heart, ArrowUpRight, Calendar } from 'lucide-react'

type Period = '7d' | '30d' | '90d'

const PERIOD_LABELS: Record<Period, string> = {
  '7d': 'Últimos 7 días',
  '30d': 'Últimos 30 días',
  '90d': 'Últimos 90 días',
}

const KPI_DATA: Record<Period, { views: number; viewsChange: number; inquiries: number; inquiriesChange: number; saved: number; savedChange: number; conversion: number; conversionChange: number }> = {
  '7d':  { views: 312,  viewsChange: +12,  inquiries: 6,  inquiriesChange: +2,  saved: 8,  savedChange: +3,  conversion: 1.9,  conversionChange: -0.3 },
  '30d': { views: 1284, viewsChange: +18,  inquiries: 23, inquiriesChange: +5,  saved: 31, savedChange: +8,  conversion: 3.2,  conversionChange: -0.4 },
  '90d': { views: 3760, viewsChange: +31,  inquiries: 74, inquiriesChange: +19, saved: 99, savedChange: +22, conversion: 2.8,  conversionChange: +0.6 },
}

const TOP_PROPERTIES = [
  { id: '1', title: 'Departamento en Palermo', views: 512, inquiries: 12, saved: 18, trend: +8 },
  { id: '2', title: 'Casa en Belgrano', views: 341, inquiries: 9, saved: 14, trend: +3 },
  { id: '3', title: 'Local en Microcentro', views: 178, inquiries: 4, saved: 7, trend: -2 },
  { id: '4', title: 'Oficina en Palermo', views: 97, inquiries: 2, saved: 3, trend: +1 },
]

const TRAFFIC_SOURCES = [
  { label: 'Búsqueda directa', pct: 42, color: '#1A6B5A' },
  { label: 'Recomendaciones IA', pct: 28, color: '#104538' },
  { label: 'Alertas de precio', pct: 17, color: '#3b82f6' },
  { label: 'Otros', pct: 13, color: '#d1d5db' },
]

const WEEKLY_VIEWS = [38, 52, 47, 61, 75, 68, 84]
const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const MAX_VIEW = Math.max(...WEEKLY_VIEWS)

function StatCard({ label, value, change, icon: Icon }: { label: string; value: string; change: number; icon: typeof Eye }) {
  const positive = change >= 0
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
          <Icon size={15} className="text-gray-400" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className={`text-xs font-medium flex items-center gap-1 ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {positive ? '+' : ''}{change}{typeof change === 'number' && Math.abs(change) < 10 ? '' : '%'} vs período anterior
      </p>
    </div>
  )
}

export default function EstadisticasPage() {
  const [period, setPeriod] = useState<Period>('30d')
  const data = KPI_DATA[period]

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 mb-1">Inmobiliaria</p>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Estadísticas
          </h1>
          <p className="text-gray-500 text-sm mt-1">Rendimiento de tus publicaciones</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${period === p ? 'text-white border-transparent' : 'text-gray-500 border-gray-200 hover:border-gray-300 bg-white'}`}
              style={period === p ? { backgroundColor: '#1A6B5A' } : undefined}
            >
              <Calendar size={12} />
              {p === '7d' ? '7 días' : p === '30d' ? '30 días' : '90 días'}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Vistas totales" value={data.views.toLocaleString('es-AR')} change={data.viewsChange} icon={Eye} />
        <StatCard label="Consultas recibidas" value={String(data.inquiries)} change={data.inquiriesChange} icon={MessageSquare} />
        <StatCard label="Guardadas por usuarios" value={String(data.saved)} change={data.savedChange} icon={Heart} />
        <StatCard label="Tasa de conversión" value={`${data.conversion}%`} change={data.conversionChange} icon={ArrowUpRight} />
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mb-6">
        {/* Weekly bar chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-1 text-sm">Vistas por día (última semana)</h2>
          <p className="text-xs text-gray-400 mb-5">Visitas a tus propiedades los últimos 7 días</p>
          <div className="flex items-end gap-2 h-36">
            {WEEKLY_VIEWS.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">{v}</span>
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${(v / MAX_VIEW) * 112}px`,
                    backgroundColor: i === WEEKLY_VIEWS.length - 1 ? '#1A6B5A' : '#d1fae5',
                  }}
                />
                <span className="text-xs text-gray-400">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-1 text-sm">Origen del tráfico</h2>
          <p className="text-xs text-gray-400 mb-5">¿Cómo llegan los usuarios a tus propiedades?</p>
          <div className="space-y-3">
            {TRAFFIC_SOURCES.map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">{label}</span>
                  <span className="text-xs font-bold text-gray-900">{pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top properties */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-50">
          <h2 className="font-bold text-gray-900 text-sm">Propiedades con más actividad</h2>
          <span className="text-xs text-gray-400">{PERIOD_LABELS[period]}</span>
        </div>
        <div className="divide-y divide-gray-50">
          {TOP_PROPERTIES.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
              <span className="w-5 text-xs font-bold text-gray-300 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{p.title}</p>
              </div>
              <div className="flex items-center gap-6 text-xs text-gray-500 flex-shrink-0">
                <span className="flex items-center gap-1"><Eye size={12} /> {p.views}</span>
                <span className="flex items-center gap-1"><MessageSquare size={12} /> {p.inquiries}</span>
                <span className="flex items-center gap-1"><Heart size={12} /> {p.saved}</span>
                <span className={`flex items-center gap-0.5 font-semibold ${p.trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {p.trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {p.trend >= 0 ? '+' : ''}{p.trend}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
