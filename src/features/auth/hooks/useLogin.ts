// @req FR-AUTH-001, FR-AUTH-002, FR-AUTH-003
import { useMutation } from '@tanstack/react-query'
import api from '@/shared/api/axiosInstance'
import { saveToken } from '@/features/auth/utils/tokenStorage'
import type { AuthRequest, AuthResponse } from '@/features/auth/types'

const login = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', {
    username: data.username,
    password: data.password,
    expiresInMins: 60,
  })
  return response.data
}

export const useLogin = () =>
  useMutation({
    mutationFn: login,
    onSuccess: (data, variables, context) => {
      // token saving happens in the component after getting rememberMe value
      void data
      void variables
      void context
    },
  })
