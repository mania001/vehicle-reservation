import { useForm } from 'react-hook-form'
import { LoginFormValues, loginSchema } from '../schema/login-schema'
import { zodResolver } from '@hookform/resolvers/zod'

export function useLoginForm() {
  return useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
}
