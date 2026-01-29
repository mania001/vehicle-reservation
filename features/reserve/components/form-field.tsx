import { Label } from '@/components/ui/label'
import { FormFieldProps } from '../types'
import { Input } from '@/components/ui/input'

export const FormField = ({ label, id, icon, type = 'text', placeholder }: FormFieldProps) => (
  <div className="space-y-1.5 px-0.5">
    <Label htmlFor={id} className="text-xs font-semibold text-slate-400 ml-1">
      {label}
    </Label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">{icon}</div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="pl-11 h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-600/20"
      />
    </div>
  </div>
)
