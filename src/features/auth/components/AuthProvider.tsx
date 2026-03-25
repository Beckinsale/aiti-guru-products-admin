import { useState, useCallback, useEffect, type ReactNode } from 'react'
import { AuthContext } from '@/features/auth/context/AuthContext'
import { getToken, saveToken, clearToken } from '@/features/auth/utils/tokenStorage'
import { setUnauthorizedHandler } from '@/shared/api/axiosInstance'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getToken())

  const login = useCallback((newToken: string, remember: boolean) => {
    saveToken(newToken, remember)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setToken(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [logout])

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
