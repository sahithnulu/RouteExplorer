import { refreshAccessToken } from './auth'

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('accessToken')

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  })

  if (response.status === 401) {
    const newToken = await refreshAccessToken()

    if (!newToken) {
      window.location.href = '/login'
      return response
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`
      }
    })
  }

  return response
}