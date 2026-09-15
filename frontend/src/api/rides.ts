import { fetchWithAuth } from './fetchWithAuth'

const BASE_URL = 'https://ram6mjcwc7.execute-api.us-east-1.amazonaws.com/prod/api'

export const createRide = async (): Promise<{ rideId: string }> => {
  const response = await fetchWithAuth(`${BASE_URL}/rides`, { method: 'POST' })
  return response.json()
}

export const endRide = async (rideId: string): Promise<void> => {
  await fetchWithAuth(`${BASE_URL}/rides/${rideId}/end`, { method: 'PATCH' })
}

export const fetchRides = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/rides`)
  return response.json()
}

export const fetchRide = async (rideId: string) => {
  const response = await fetchWithAuth(`${BASE_URL}/rides/${rideId}`)
  return response.json()
}