'use client'

import { forwardRef, ReactNode } from 'react'
import { PatternFormat, PatternFormatProps } from 'react-number-format'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface PhoneFieldProps extends Omit<
  PatternFormatProps,
  'format' | 'onValueChange' | 'customInput' | 'onChange' | 'value'
> {
  label?: string
  icon?: ReactNode
  error?: string
  hiddenLabel?: boolean

  value?: string // raw
  onChange?: (value: string) => void // raw
}

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  ({ label, icon, error, hiddenLabel = false, value, onChange, className, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 px-1">
        {/* label */}
        {!hiddenLabel && label && (
          <Label htmlFor={id} className="text-xs font-semibold text-slate-400 ml-1">
            {label}
          </Label>
        )}

        {/* input wrapper */}
        <div className="relative group">
          {/* icon */}
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-slate-400">
              {icon}
            </div>
          )}

          <PatternFormat
            id={id}
            format="###-####-####"
            valueIsNumericString
            value={value}
            onValueChange={values => {
              onChange?.(values.value) // 👉 raw 값
            }}
            getInputRef={ref}
            customInput={Input}
            inputMode="numeric"
            className={cn(
              'w-full h-14 rounded-2xl bg-slate-50 border-none px-4 text-base font-medium transition-all focus:ring-2 shadow-sm',
              icon && 'pl-11',
              error && 'focus:ring-red-500/20',
              className,
            )}
            {...props}
          />
        </div>

        {/* error */}
        {error && <p className="text-xs text-red-500 mt-1.5">* {error}</p>}
      </div>
    )
  },
)

PhoneField.displayName = 'PhoneField'
