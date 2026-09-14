const BASE_URL = 'http://localhost:3000/api'

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return null

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })

    if (!response.ok) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      return null
    }

    const data = await response.json()
    localStorage.setItem('accessToken', data.accessToken)
    return data.accessToken
  } catch {
    return null
  }
}