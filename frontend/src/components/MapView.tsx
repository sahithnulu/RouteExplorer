// src/components/MapView.tsx
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useRide } from '../hooks/useRide'
import { useCoverage } from '../hooks/useCoverage'
import RideTracker from './RideTracker'
import RideHistory from './RideHistory'

const MapView = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  const { loadCoverage } = useCoverage(mapRef)
  const { isRiding, elapsed, distance, startRide, stopRide } = useRide(mapRef, loadCoverage)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    mapRef.current = L.map(mapContainerRef.current).setView([45.4215, -75.6972], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current)

    loadCoverage()

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      <RideTracker
        isRiding={isRiding}
        elapsed={elapsed}
        distance={distance}
        onStart={startRide}
        onStop={stopRide}
      />
      {!isRiding && <RideHistory mapRef={mapRef} />}
    </div>
  )
}

export default MapView