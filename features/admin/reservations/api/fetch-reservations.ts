import { ReservationTabId } from '../constants/reservation-tabs'
import { AdminReservationListItem } from '../types/reservaiton-list-item'

export async function fetchReservations(tab: ReservationTabId) {
  const res = await fetch(`/api/admin/reservations?tab=${tab}`)
  if (!res.ok) throw new Error('Failed to fetch reservations')
  return (await res.json()).data as Promise<{ items: AdminReservationListItem[] }>
}
