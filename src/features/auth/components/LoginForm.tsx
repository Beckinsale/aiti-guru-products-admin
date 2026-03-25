// @req FR-AUTH-001, FR-AUTH-002, FR-AUTH-003, FR-AUTH-004
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { loginSchema, type LoginFormValues } from '@/features/auth/validators/loginSchema'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { useAuthContext } from '@/features/auth/hooks/useAuthContext'
import { isAxiosError } from 'axios'

export const LoginForm = () => {
  const navigate = useNavigate()
  const { login } = useAuthContext()
  const { mutate, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as Resolver<LoginFormValues>,
    defaultValues: { username: '', password: '', rememberMe: false },
  })

  const onSubmit = (values: LoginFormValues) => {
    mutate(
      { username: values.username, password: values.password },
      {
        onSuccess: (data) => {
          login(data.accessToken, values.rememberMe)
          void navigate('/products')
        },
        onError: (err) => {
          const message =
            isAxiosError(err) && err.response?.data
              ? String((err.response.data as { message?: string }).message ?? 'Ошибка авторизации')
              : 'Ошибка авторизации'
          setError('root', { message })
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
          Логин
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition
            focus:ring-2 focus:ring-violet-500 focus:border-violet-500
            ${errors.username ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="emilys"
          {...register('username')}
        />
        {errors.username && (
          <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition
            focus:ring-2 focus:ring-violet-500 focus:border-violet-500
            ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {errors.root && (
        <p className="mb-4 text-xs text-red-500">{errors.root.message}</p>
      )}

      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 accent-violet-600"
            {...register('rememberMe')}
          />
          <span className="text-sm text-gray-600">Запомнить меня</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60
          text-white text-sm font-medium rounded-lg transition cursor-pointer"
      >
        {isPending ? 'Вход...' : 'Войти'}
      </button>

      <p className="mt-4 text-center text-sm text-gray-500">
        Нет аккаунта?{' '}
        {/* @req FR-AUTH-004 — stub link, no navigation */}
        <span className="text-violet-600 cursor-pointer hover:underline">Создать</span>
      </p>
    </form>
  )
}
