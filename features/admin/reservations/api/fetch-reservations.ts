import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { ReservationTabId } from '../constants/reservation-tabs'

export async function fetchReservations(tab: ReservationTabId) {
  const res = await fetch(`/api/admin/reservations?tab=${tab}`)
  if (!res.ok) throw new Error('Failed to fetch reservations')
  return (await res.json()).data as Promise<{ items: AdminBookingItem[] }>
}
