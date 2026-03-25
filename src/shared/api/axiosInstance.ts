import axios from 'axios'
import { getToken } from '@/features/auth/utils/tokenStorage'

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: { 'Content-Type': 'application/json' },
})

let unauthorizedHandler: (() => void) | null = null

export const setUnauthorizedHandler = (handler: () => void): void => {
  unauthorizedHandler = handler
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      unauthorizedHandler?.()
    }
    return Promise.reject(error)
  },
)

export default api
