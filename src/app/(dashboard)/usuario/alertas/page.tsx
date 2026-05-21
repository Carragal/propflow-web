'use client'

import { useState } from 'react'
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, MapPin, TrendingDown } from 'lucide-react'
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants'

interface Alert {
  id: string
  label: string
  operation: string
  type: string
  city: string
  maxPrice: number
  currency: 'USD' | 'ARS'
  active: boolean
  lastMatch: number
}

const INITIAL_ALERTS: Alert[] = [
  { id: '1', label: 'Depto en Palermo', operation: 'venta', type: 'departamento', city: 'Buenos Aires', maxPrice: 150000, currency: 'USD', active: true, lastMatch: 3 },
  { id: '2', label: 'Casa familiar Belgrano', operation: 'venta', type: 'casa', city: 'Buenos Aires', maxPrice: 300000, currency: 'USD', active: false, lastMatch: 0 },
]

export default function AlertasPage() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ label: '', operation: 'venta', type: 'departamento', city: '', maxPrice: '' })

  const toggle = (id: string) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)))

  const remove = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id))

  const addAlert = () => {
    if (!form.label || !form.city) return
    setAlerts((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        ...form,
        maxPrice: Number(form.maxPrice) || 0,
        currency: 'USD',
        active: true,
        lastMatch: 0,
      },
    ])
    setForm({ label: '', operation: 'venta', type: 'departamento', city: '', maxPrice: '' })
    setShowNew(false)
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 mb-1">Mi cuenta</p>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Alertas de precio
          </h1>
          <p className="text-gray-500 text-sm mt-1">Recibí un aviso cuando aparezca una propiedad que coincida.</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
          style={{ backgroundColor: '#1A6B5A' }}
        >
          <Plus size={16} /> Nueva alerta
        </button>
      </div>

      {/* New alert form */}
      {showNew && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Configurar nueva alerta</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre de la alerta</label>
              <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Ej: Depto en Palermo" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Ciudad</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Ej: Buenos Aires" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Operación</label>
              <select value={form.operation} onChange={(e) => setForm({ ...form, operation: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white">
                {['venta', 'alquiler'].map((op) => <option key={op} value={op}>{OPERATION_TYPE_LABELS[op]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white">
                {['departamento', 'casa', 'terreno', 'local', 'oficina'].map((t) => <option key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Precio máximo (USD)</label>
              <input type="number" value={form.maxPrice} onChange={(e) => setForm({ ...form, maxPrice: e.target.value })} placeholder="Ej: 150000" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addAlert} className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: '#1A6B5A' }}>
              Crear alerta
            </button>
            <button onClick={() => setShowNew(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Alerts list */}
      {alerts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Bell size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 font-medium">No tenés alertas configuradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`bg-white rounded-2xl border p-5 transition-all ${alert.active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{alert.label}</h3>
                    {alert.active && alert.lastMatch > 0 && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#1A6B5A' }}>
                        {alert.lastMatch} nuevas
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={11} />{alert.city}</span>
                    <span>{PROPERTY_TYPE_LABELS[alert.type]}</span>
                    <span>{OPERATION_TYPE_LABELS[alert.operation]}</span>
                    {alert.maxPrice > 0 && (
                      <span className="flex items-center gap-1"><TrendingDown size={11} />Hasta {alert.currency} {alert.maxPrice.toLocaleString('es-AR')}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggle(alert.id)} className="text-gray-400 hover:text-gray-600 transition-colors" title={alert.active ? 'Desactivar' : 'Activar'}>
                    {alert.active
                      ? <ToggleRight size={26} style={{ color: '#1A6B5A' }} />
                      : <ToggleLeft size={26} />}
                  </button>
                  <button onClick={() => remove(alert.id)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
