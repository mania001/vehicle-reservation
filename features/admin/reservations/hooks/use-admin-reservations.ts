'use client'

import { useQuery } from '@tanstack/react-query'
import { ReservationTabId } from '../constants/reservation-tabs'
import { adminReservationQueryKeys } from '../query-keys'

export function useAdminReservations(tab: ReservationTabId) {
  return useQuery({
    queryKey: adminReservationQueryKeys.list(tab),
    queryFn: async () => {
      const res = await fetch(`/api/admin/reservations?tab=${tab}`)
      if (!res.ok) throw new Error('Failed to fetch reservations')
      return res.json()
    },
    staleTime: 0, // 관리자 화면은 staleTime 길게 두면 안됨
    refetchInterval: 10000, // ✅ 10초마다 자동 갱신
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}
