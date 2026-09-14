import { fetchWithAuth } from './fetchWithAuth'

const BASE_URL = 'http://localhost:3000/api'

export const fetchCoverage = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/coverage`)
  return response.json()
}