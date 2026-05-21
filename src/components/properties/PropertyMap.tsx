'use client'

import { useEffect, useRef } from 'react'
import type { Property } from '@/types/property'
import { formatPrice } from '@/lib/utils'

interface PropertyMapProps {
  properties: Property[]
  selectedId?: string
  onSelect?: (id: string) => void
  className?: string
}

export default function PropertyMap({
  properties,
  selectedId,
  onSelect,
  className,
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const markersRef = useRef<unknown[]>([])

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return
    if (mapInstanceRef.current) return
    // StrictMode / hot-reload guard: if Leaflet already stamped this container, bail
    if ((mapRef.current as unknown as Record<string, unknown>)._leaflet_id) return

    import('leaflet').then((L) => {
      if (!mapRef.current) return
      if ((mapRef.current as unknown as Record<string, unknown>)._leaflet_id) return

      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const center: [number, number] =
        properties.length > 0
          ? [properties[0].lat, properties[0].lng]
          : [-34.6037, -58.3816]

      const map = L.map(mapRef.current, {
        center,
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map

      properties.forEach((property) => {
        const isSelected = property.id === selectedId
        const iconHtml = `
          <div style="
            background: ${isSelected ? '#1A6B5A' : '#ffffff'};
            color: ${isSelected ? '#fff' : '#1a1a1a'};
            border: 2px solid ${isSelected ? '#1A6B5A' : '#d1d5db'};
            border-radius: 8px;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            cursor: pointer;
            font-family: system-ui, sans-serif;
          ">
            ${formatPrice(property.price, property.currency)}
          </div>
        `

        const icon = L.divIcon({
          html: iconHtml,
          className: '',
          iconAnchor: [0, 0],
        })

        const marker = L.marker([property.lat, property.lng], { icon })
          .addTo(map)
          .on('click', () => onSelect?.(property.id))

        markersRef.current.push(marker)
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        ;(mapInstanceRef.current as { remove: () => void }).remove()
        mapInstanceRef.current = null
        markersRef.current = []
      }
    }
  }, [])

  // Update markers on selection change
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === 'undefined') return
    import('leaflet').then((L) => {
      markersRef.current.forEach((marker, i) => {
        const property = properties[i]
        if (!property) return
        const isSelected = property.id === selectedId
        const iconHtml = `
          <div style="
            background: ${isSelected ? '#1A6B5A' : '#ffffff'};
            color: ${isSelected ? '#fff' : '#1a1a1a'};
            border: 2px solid ${isSelected ? '#1A6B5A' : '#d1d5db'};
            border-radius: 8px;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            cursor: pointer;
            font-family: system-ui, sans-serif;
          ">
            ${formatPrice(property.price, property.currency)}
          </div>
        `
        ;(marker as { setIcon: (icon: unknown) => void }).setIcon(
          L.divIcon({ html: iconHtml, className: '', iconAnchor: [0, 0] })
        )
      })
    })
  }, [selectedId, properties])

  return (
    <div className={className}>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />
    </div>
  )
}
