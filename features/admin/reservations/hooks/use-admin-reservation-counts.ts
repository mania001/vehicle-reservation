'use client'

import { useQuery } from '@tanstack/react-query'
import { ReservationCountsResponse } from '../types/reservaiton-list-item'

export function useAdminReservationCounts() {
  return useQuery<ReservationCountsResponse>({
    queryKey: ['admin-reservations-counts'],
    queryFn: async () => {
      const res = await fetch('/api/admin/reservations/counts')
      if (!res.ok) throw new Error('Failed to fetch reservation counts')
      return res.json()
    },
    refetchInterval: 1000 * 30, // 30초마다 갱신
  })
}
