// @req FR-AUTH-001, FR-AUTH-003
import { useMutation } from '@tanstack/react-query'
import api from '@/shared/api/axiosInstance'
import type { AuthRequest, AuthResponse } from '@/features/auth/types'

const loginRequest = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', {
    username: data.username,
    password: data.password,
    expiresInMins: 60,
  })
  return response.data
}

export const useLogin = () => useMutation({ mutationFn: loginRequest })
