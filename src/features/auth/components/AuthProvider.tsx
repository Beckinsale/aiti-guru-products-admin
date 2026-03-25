// @req FR-AUTH-002
import { createContext, useState, useEffect, type ReactNode } from 'react'
import { getToken, saveToken, clearToken } from '@/features/auth/utils/tokenStorage'
import { setUnauthorizedHandler } from '@/shared/api/axiosInstance'

interface AuthContextValue {
  token: string | null
  login: (token: string, remember: boolean) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getToken())

  const login = (newToken: string, remember: boolean) => {
    saveToken(newToken, remember)
    setToken(newToken)
  }

  const logout = () => {
    clearToken()
    setToken(null)
  }

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
