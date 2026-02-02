'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reservationCoreSchema } from '@/domains/reservation/reservation.schema'
import { z } from 'zod'

export type ReserveFormValues = z.infer<typeof reservationCoreSchema>

export function useReserveForm() {
  return useForm<ReserveFormValues>({
    resolver: zodResolver(reservationCoreSchema),
    mode: 'onChange',
  })
}
