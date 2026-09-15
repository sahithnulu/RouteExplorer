import { fetchWithAuth } from './fetchWithAuth'

const BASE_URL = 'https://ram6mjcwc7.execute-api.us-east-1.amazonaws.com/prod/api'

export const fetchCoverage = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/coverage`)
  return response.json()
}