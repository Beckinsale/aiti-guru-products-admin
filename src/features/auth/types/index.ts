// @req FR-AUTH-001, FR-AUTH-002, FR-AUTH-003

export interface AuthRequest {
  username: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  id: number
  username: string
  email: string
}

export interface User {
  id: number
  username: string
  email: string
}
