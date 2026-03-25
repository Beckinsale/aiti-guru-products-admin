// @req FR-AUTH-001, FR-AUTH-002, FR-AUTH-003, FR-AUTH-004
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { isAxiosError } from 'axios'
import { loginSchema, type LoginFormValues } from '@/features/auth/validators/loginSchema'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { useAuthContext } from '@/features/auth/hooks/useAuthContext'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export const LoginForm = () => {
  const navigate = useNavigate()
  const { login } = useAuthContext()
  const { mutate, isPending } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as Resolver<LoginFormValues>,
    defaultValues: { username: '', password: '', rememberMe: false },
  })

  const rememberMe = watch('rememberMe')

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 w-full">
      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">Логин</Label>
        <div
          className={[
            'flex items-center gap-3.5 bg-white border-[1.5px] rounded-[12px] px-4 py-3.5',
            errors.username ? 'border-red-400' : 'border-[#ededed]',
            'focus-within:border-[#242edb] focus-within:ring-2 focus-within:ring-[#242edb]/20 transition',
          ].join(' ')}
        >
          <User className="h-6 w-6 text-[#b2b3b9] shrink-0" />
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="emilys"
            className="flex-1 font-['Inter',sans-serif] font-medium text-[18px] text-[#232323] tracking-[-0.27px] leading-normal placeholder:text-[#c0c0c0] placeholder:font-normal outline-none bg-transparent"
            {...register('username')}
          />
        </div>
        {errors.username && (
          <p className="text-xs text-red-500">{errors.username.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Пароль</Label>
        <div
          className={[
            'flex items-center gap-3.5 bg-white border-[1.5px] rounded-[12px] px-4 py-3.5',
            errors.password ? 'border-red-400' : 'border-[#ededed]',
            'focus-within:border-[#242edb] focus-within:ring-2 focus-within:ring-[#242edb]/20 transition',
          ].join(' ')}
        >
          <Lock className="h-6 w-6 text-[#b2b3b9] shrink-0" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            className="flex-1 font-['Inter',sans-serif] font-medium text-[18px] text-[#232323] tracking-[-0.27px] leading-normal placeholder:text-[#c0c0c0] placeholder:font-normal outline-none bg-transparent"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-[#b2b3b9] hover:text-[#666] transition cursor-pointer shrink-0"
            tabIndex={-1}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* API error */}
      {errors.root && (
        <p className="text-xs text-red-500 -mt-2">{errors.root.message}</p>
      )}

      {/* Remember me — @req FR-AUTH-002 */}
      <div className="flex items-center gap-2.5">
        <Checkbox
          id="rememberMe"
          checked={rememberMe}
          onCheckedChange={(checked) => setValue('rememberMe', checked === true)}
        />
        <label
          htmlFor="rememberMe"
          className="font-['Inter',sans-serif] font-medium text-[16px] text-[#9c9c9c] leading-normal cursor-pointer select-none"
        >
          Запомнить данные
        </label>
      </div>

      {/* Submit button */}
      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="relative w-full py-4 rounded-[12px] border border-[#367aff] overflow-hidden
            font-['Inter',sans-serif] font-semibold text-[18px] text-white tracking-[-0.18px] leading-[1.2]
            shadow-[0px_8px_8px_0px_rgba(54,122,255,0.03)]
            disabled:opacity-60 cursor-pointer transition"
          style={{
            background:
              'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%), #242edb',
          }}
        >
          <span className="relative z-10">{isPending ? 'Вход...' : 'Войти'}</span>
          <span
            className="absolute inset-0 rounded-[12px] pointer-events-none"
            style={{ boxShadow: 'inset 0px -2px 0px 1px rgba(0,0,0,0.08)' }}
          />
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2.5">
          <div className="flex-1 h-px bg-[#ebebeb]" />
          <span className="font-['Inter',sans-serif] font-medium text-[16px] text-[#ebebeb]">или</span>
          <div className="flex-1 h-px bg-[#ebebeb]" />
        </div>
      </div>

      {/* @req FR-AUTH-004 — stub link, no navigation */}
      <p className="text-center font-['Inter',sans-serif] font-normal text-[18px] text-[#6c6c6c] leading-normal">
        Нет аккаунта?{' '}
        <span className="font-semibold text-[#242edb] underline underline-offset-2 cursor-pointer hover:text-[#1d26c5]">
          Создать
        </span>
      </p>
    </form>
  )
}
