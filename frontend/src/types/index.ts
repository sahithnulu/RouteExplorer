// src/types/index.ts
export interface Ride {
  id: string
  started_at: string
  ended_at: string
  distance_meters: number
  duration_seconds: number
  status: string
}

export interface GpsPoint {
  rideId: string
  lat: number
  lng: number
  timestamp: string
  sequenceNumber: number
}