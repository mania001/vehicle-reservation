import { DriverFormValues, driverSchema } from '../schema/driver-schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function useDriverForm() {
  return useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    mode: 'onChange',
  })
}
