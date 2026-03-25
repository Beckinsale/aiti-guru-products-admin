// @req FR-AUTH-002
import { useContext } from 'react'
import { AuthContext } from '@/features/auth/components/AuthProvider'

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
