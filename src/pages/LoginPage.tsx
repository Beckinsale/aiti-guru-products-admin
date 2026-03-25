// @req FR-AUTH-001
import { LoginForm } from '@/features/auth/components/LoginForm'
import { Logo } from '@/components/Logo'

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4">
      <div className="bg-white rounded-[40px] shadow-[0px_24px_32px_0px_rgba(0,0,0,0.04)] p-1.5 w-131.75 max-w-full">
        <div
          className="border border-[#ededed] rounded-[34px] px-12 py-12 flex flex-col items-center gap-8"
          style={{
            background:
              'linear-gradient(0deg, rgba(35,35,35,0) 50%, rgba(35,35,35,0.03) 100%), #fff',
          }}
        >
          {/* Logo */}
          <div
            className="flex items-center justify-center w-13 h-13 rounded-full border border-[rgba(237,237,237,0.7)] shadow-[0px_0px_0px_2px_white,0px_12px_8px_0px_rgba(0,0,0,0.03)]"
            style={{
              background:
                'linear-gradient(0deg, rgba(35,35,35,0) 50%, rgba(35,35,35,0.06) 100%), #fff',
            }}
          >
            <Logo />
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="font-['Inter',sans-serif] font-semibold text-[40px] text-[#232323] tracking-[-0.6px] leading-[1.1] whitespace-nowrap">
              Добро пожаловать!
            </h1>
            <p className="font-['Inter',sans-serif] font-medium text-[18px] text-[#e0e0e0] leading-normal">
              Пожалуйста, авторизируйтесь
            </p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
