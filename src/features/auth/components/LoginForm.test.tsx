// @req FR-AUTH-001, FR-AUTH-003
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/components/AuthProvider'
import { LoginForm } from '@/features/auth/components/LoginForm'
import axios from 'axios'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

const renderForm = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
  })

  it('shows required field errors when submitted empty', async () => {
    renderForm()
    await userEvent.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      expect(screen.getAllByText('Обязательное поле')).toHaveLength(2)
    })
  })

  it('shows only password error when only username is filled', async () => {
    renderForm()
    await userEvent.type(screen.getByPlaceholderText('emilys'), 'admin')
    await userEvent.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      expect(screen.getAllByText('Обязательное поле')).toHaveLength(1)
    })
  })

  it('redirects to /products on successful login', async () => {
    vi.spyOn(axios, 'post').mockResolvedValueOnce({
      data: { accessToken: 'test-token', id: 1, username: 'emilys', email: 'emilys@example.com' },
    })

    renderForm()
    await userEvent.type(screen.getByPlaceholderText('emilys'), 'emilys')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'emilyspass')
    await userEvent.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/products')
    })
  })

  it('shows API error message under fields on failed login', async () => {
    vi.spyOn(axios, 'post').mockRejectedValueOnce(
      Object.assign(new Error('Unauthorized'), {
        isAxiosError: true,
        response: { data: { message: 'Invalid credentials' }, status: 401 },
      }),
    )

    renderForm()
    await userEvent.type(screen.getByPlaceholderText('emilys'), 'wronguser')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})
