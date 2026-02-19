'use client'

import { useQuery } from '@tanstack/react-query'
import { ReservationCountsResponse } from '../types/reservaiton-list-item'
import { adminReservationQueryKeys } from '../query-keys'
import { fetchReservationCounts } from '../api/fetch-reservation-counts'

export function useAdminReservationCounts() {
  return useQuery<ReservationCountsResponse>({
    queryKey: adminReservationQueryKeys.counts(),
    queryFn: fetchReservationCounts,
    refetchInterval: 1000 * 30, // 30초마다 갱신
  })
}
