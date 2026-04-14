'use client'

import { useQuery } from '@tanstack/react-query'
import { ReservationTabId } from '../constants/reservation-tabs'
import { adminReservationQueryKeys } from '../query-keys'
import { fetchReservations } from '../api/fetch-reservations'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'

export function useAdminReservations(
  tab: ReservationTabId,
  options?: {
    initialData?: { items: AdminBookingItem[] }
  },
) {
  return useQuery({
    queryKey: adminReservationQueryKeys.list(tab),
    queryFn: () => fetchReservations(tab),
    initialData: options?.initialData,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  })
}
