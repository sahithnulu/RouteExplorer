// src/hooks/useCoverage.ts
import { useRef, useCallback } from 'react'
import L from 'leaflet'
import { fetchCoverage } from '../api/coverage'

export const useCoverage = (mapRef: React.RefObject<L.Map | null>) => {
  const coverageLayerRef = useRef<L.GeoJSON | null>(null)

  const loadCoverage = useCallback(async () => {
    try {
      const data = await fetchCoverage()

      if (coverageLayerRef.current) {
        mapRef.current?.removeLayer(coverageLayerRef.current)
      }

      if (data.features.length > 0) {
        coverageLayerRef.current = L.geoJSON(data, {
          style: {
            color: '#378ADD',
            fillColor: '#378ADD',
            fillOpacity: 0.2,
            weight: 1
          }
        }).addTo(mapRef.current!)
      }
    } catch (error) {
      console.error('Error loading coverage:', error)
    }
  }, [mapRef])

  return { loadCoverage }
}