// @req FR-AUTH-001
import { LoginForm } from '@/features/auth/components/LoginForm'

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-10">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Вход</h1>
          <p className="text-sm text-gray-500 mb-6">Введите данные для входа в систему</p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
