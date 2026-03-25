import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-[55px] w-full rounded-xl border border-[#ededed] bg-white px-4 py-3 text-[18px] font-medium font-["Inter",sans-serif] tracking-[-0.27px]',
          'placeholder:text-[#c0c0c0] placeholder:font-normal',
          'focus:outline-none focus:ring-2 focus:ring-[#242edb]/30 focus:border-[#242edb]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
