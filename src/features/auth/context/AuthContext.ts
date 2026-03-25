// @req FR-AUTH-002
import { createContext } from 'react'

export interface AuthContextValue {
  token: string | null
  login: (token: string, remember: boolean) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
