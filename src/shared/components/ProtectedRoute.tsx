// @req FR-AUTH-002
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/features/auth/hooks/useAuthContext'
import type { ReactNode } from 'react'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuthContext()
  return token ? <>{children}</> : <Navigate to="/login" replace />
}
