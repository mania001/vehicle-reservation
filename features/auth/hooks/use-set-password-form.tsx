import { useForm } from 'react-hook-form'
import { SetPasswordFormValues, setPasswordSchema } from '../schema/set-password-schema'
import { zodResolver } from '@hookform/resolvers/zod'

export function useSetPasswordForm() {
  return useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
  })
}
