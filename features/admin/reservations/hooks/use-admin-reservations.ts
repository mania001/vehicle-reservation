import { useQuery } from '@tanstack/react-query'
import { ReservationTabId } from '../constants/reservation-tabs'

export function useAdminReservations(tab: ReservationTabId) {
  return useQuery({
    queryKey: ['admin-reservations', tab],
    queryFn: async () => {
      const res = await fetch(`/api/admin/reservations?tab=${tab}`)
      if (!res.ok) throw new Error('Failed to fetch reservations')
      return res.json()
    },
  })
}
