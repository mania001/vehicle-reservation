import { Label } from '@/components/ui/label'
// import { FormFieldProps } from '../types'
import { Input } from '@/components/ui/input'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// InputHTMLAttributes를 상속받아 기본 input 속성(name, onChange, onBlur 등)을 포함합니다.
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: React.ReactNode
  error?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, icon, error, className, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 px-1">
        <Label htmlFor={id} className="text-xs font-semibold text-slate-400 ml-1">
          {label}
        </Label>
        <div className="relative group">
          {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">{icon}</div>}
          <Input
            id={id}
            ref={ref}
            className={cn(
              'w-full h-14 rounded-2xl bg-slate-50 border-none px-4 flex items-center text-base font-medium transition-all focus:ring-2 shadow-sm',
              icon && 'pl-11', // 아이콘이 있을 경우 왼쪽 패딩 확보
              className,
            )}
            // className="pl-11 h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-600/20"
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 mt-1.5">* {error}</p>}
      </div>
    )
  },
)

FormField.displayName = 'FormField'

// ({ label, id, icon, type = 'text', placeholder }: FormFieldProps) => (
//   <div className="space-y-1.5 px-0.5">
//     <Label htmlFor={id} className="text-xs font-semibold text-slate-400 ml-1">
//       {label}
//     </Label>
//     <div className="relative">
//       <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">{icon}</div>
//       <Input
//         id={id}
//         type={type}
//         placeholder={placeholder}
//         className="pl-11 h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-600/20"
//       />
//     </div>
//   </div>
// )
