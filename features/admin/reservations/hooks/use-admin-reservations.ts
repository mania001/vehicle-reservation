'use client'

import { useQuery } from '@tanstack/react-query'
import { ReservationTabId } from '../constants/reservation-tabs'
import { adminReservationQueryKeys } from '../query-keys'
import { fetchReservations } from '../api/fetch-reservations'

export function useAdminReservations(tab: ReservationTabId) {
  return useQuery({
    queryKey: adminReservationQueryKeys.list(tab),
    queryFn: () => fetchReservations(tab),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30, // ✅ 30초마다 자동 갱신
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,
  })
}
