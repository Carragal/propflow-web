'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, Map, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react'
import type { Property, PropertyFilters } from '@/types/property'
import PropertyCard from './PropertyCard'
import PropertyFiltersComponent from './PropertyFilters'
import SearchBar from '@/components/search/SearchBar'
import { cn } from '@/lib/utils'

const PropertyMap = dynamic(() => import('./PropertyMap'), { ssr: false })

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest'
const SORT_LABELS: Record<SortOption, string> = {
  relevance: 'Relevancia',
  'price-asc': 'Menor precio',
  'price-desc': 'Mayor precio',
  newest: 'Más reciente',
}

function applyFilters(properties: Property[], filters: PropertyFilters): Property[] {
  return properties.filter((p) => {
    if (filters.operation && p.operation !== filters.operation) return false
    if (filters.type && p.type !== filters.type) return false
    if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase())) return false
    if (filters.neighborhood && !p.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())) return false
    if (filters.minPrice && p.price < filters.minPrice) return false
    if (filters.maxPrice && p.price > filters.maxPrice) return false
    if (filters.minRooms && p.rooms < filters.minRooms) return false
    if (filters.features?.length) {
      const hasAll = filters.features.every((f) => p.features.includes(f))
      if (!hasAll) return false
    }
    return true
  })
}

function applySort(properties: Property[], sort: SortOption): Property[] {
  const copy = [...properties]
  switch (sort) {
    case 'price-asc': return copy.sort((a, b) => a.price - b.price)
    case 'price-desc': return copy.sort((a, b) => b.price - a.price)
    case 'newest': return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    default: return copy.sort((a, b) => (b.aiMatchScore ?? 0) - (a.aiMatchScore ?? 0))
  }
}

interface PropertyListingClientProps {
  allProperties: Property[]
  initialFilters?: PropertyFilters
}

export default function PropertyListingClient({
  allProperties,
  initialFilters = {},
}: PropertyListingClientProps) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters)
  const [sort, setSort] = useState<SortOption>('relevance')
  const [view, setView] = useState<'grid' | 'map'>('grid')
  const [selectedId, setSelectedId] = useState<string>()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = useMemo(() => applyFilters(allProperties, filters), [allProperties, filters])
  const results = useMemo(() => applySort(filtered, sort), [filtered, sort])

  return (
    <div className="flex flex-col min-h-screen pt-16 bg-gray-50">
      {/* Top search bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <SearchBar compact className="max-w-2xl" />
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* ── Sidebar filters (desktop) ─────────────────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <PropertyFiltersComponent
                filters={filters}
                onChange={setFilters}
                resultsCount={results.length}
              />
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {results.length} {results.length === 1 ? 'propiedad' : 'propiedades'}
                </h1>
                {Object.values(filters).some(Boolean) && (
                  <p className="text-xs text-gray-400 mt-0.5">Filtros aplicados</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile filters button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                >
                  <SlidersHorizontal size={14} />
                  Filtros
                </button>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-300 hover:border-gray-300 transition-all"
                  >
                    {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                      <option key={key} value={key}>{SORT_LABELS[key]}</option>
                    ))}
                  </select>
                  <ArrowUpDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* View toggle */}
                <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-0.5">
                  <button
                    onClick={() => setView('grid')}
                    className={cn(
                      'p-1.5 rounded-lg transition-all',
                      view === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'
                    )}
                    title="Vista grilla"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setView('map')}
                    className={cn(
                      'p-1.5 rounded-lg transition-all',
                      view === 'map' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'
                    )}
                    title="Vista mapa"
                  >
                    <Map size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Grid view ── */}
            {view === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {results.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full py-20 text-center"
                    >
                      <p className="text-gray-400 text-lg">Sin resultados para estos filtros.</p>
                      <button
                        onClick={() => setFilters({})}
                        className="mt-4 text-sm font-medium underline"
                        style={{ color: '#1A6B5A' }}
                      >
                        Limpiar filtros
                      </button>
                    </motion.div>
                  ) : (
                    results.map((property, index) => (
                      <motion.div
                        key={property.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.25, delay: index * 0.04 }}
                      >
                        <PropertyCard property={property} />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── Map view ── */}
            {view === 'map' && (
              <div className="flex gap-4 h-[calc(100vh-220px)]">
                {/* Map */}
                <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <PropertyMap
                    properties={results}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    className="w-full h-full"
                  />
                </div>

                {/* Side list */}
                <div className="w-80 flex-shrink-0 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
                  {results.map((property) => (
                    <div
                      key={property.id}
                      onClick={() => setSelectedId(
                        selectedId === property.id ? undefined : property.id
                      )}
                      className={cn(
                        'cursor-pointer rounded-xl border transition-all',
                        selectedId === property.id
                          ? 'border-brand-400 shadow-md ring-1 ring-brand-200'
                          : 'border-gray-100 hover:border-gray-200'
                      )}
                      style={
                        selectedId === property.id
                          ? { borderColor: '#1A6B5A', boxShadow: '0 0 0 2px #1A6B5A22' }
                          : undefined
                      }
                    >
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filters drawer ──────────────────────── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Filtros</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
              <PropertyFiltersComponent
                filters={filters}
                onChange={setFilters}
                resultsCount={results.length}
              />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-5 w-full py-3 rounded-xl text-white font-semibold text-sm"
                style={{ backgroundColor: '#1A6B5A' }}
              >
                Ver {results.length} resultados
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
