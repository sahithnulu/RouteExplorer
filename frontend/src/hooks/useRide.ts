// src/hooks/useRide.ts
import { useRef, useState, useEffect } from 'react'
import L from 'leaflet'
import { io, Socket } from 'socket.io-client'
import { createRide, endRide } from '../api/rides'

export const useRide = (
  mapRef: React.RefObject<L.Map | null>,
  onRideEnd: () => void
) => {
  const polylineRef = useRef<L.Polyline | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const sequenceRef = useRef(0)
  const startTimeRef = useRef<Date | null>(null)
  const simulationRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [isRiding, setIsRiding] = useState(false)
  const [rideId, setRideId] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState('00:00')
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    if (!isRiding) return
    const interval = setInterval(() => {
      if (!startTimeRef.current) return
      const diff = Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000)
      const mins = String(Math.floor(diff / 60)).padStart(2, '0')
      const secs = String(diff % 60).padStart(2, '0')
      setElapsed(`${mins}:${secs}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [isRiding])

  const simulateGPS = (newRideId: string, socket: Socket) => {
    let lat = 45.4215
    let lng = -75.6972

    simulationRef.current = setInterval(() => {
      lat += 0.0001
      lng += 0.0001

      const point: L.LatLngTuple = [lat, lng]
      polylineRef.current?.addLatLng(point)
      mapRef.current?.setView(point, mapRef.current.getZoom())

      const latlngs = polylineRef.current?.getLatLngs() as L.LatLng[]
      if (latlngs.length > 1) {
        const last = latlngs[latlngs.length - 2]
        const curr = latlngs[latlngs.length - 1] as L.LatLng
        setDistance((d) => d + curr.distanceTo(last))
      }

      socket.emit('gps:point', {
        rideId: newRideId,
        lat,
        lng,
        timestamp: new Date().toISOString(),
        sequenceNumber: sequenceRef.current++
      })
    }, 1000)
  }

  const startRide = async () => {
    const token = localStorage.getItem('accessToken')
    const data = await createRide()
    const newRideId = data.rideId
    setRideId(newRideId)

    const socket = io('https://ram6mjcwc7.execute-api.us-east-1.amazonaws.com/prod', { auth: { token } })
    socketRef.current = socket

    polylineRef.current = L.polyline([], { color: '#378ADD', weight: 4 }).addTo(mapRef.current!)

    sequenceRef.current = 0
    startTimeRef.current = new Date()
    setDistance(0)
    setElapsed('00:00')
    setIsRiding(true)

    simulateGPS(newRideId, socket)
  }

  const stopRide = async () => {
    if (simulationRef.current) {
      clearInterval(simulationRef.current)
      simulationRef.current = null
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    socketRef.current?.disconnect()
    socketRef.current = null

    if (rideId) {
      await endRide(rideId)
    }

    setIsRiding(false)
    setRideId(null)
    onRideEnd()
  }

  return { isRiding, elapsed, distance, startRide, stopRide, polylineRef }
}