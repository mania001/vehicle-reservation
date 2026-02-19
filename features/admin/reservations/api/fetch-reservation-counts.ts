import { ReservationCountsResponse } from '../types/reservaiton-list-item'

export async function fetchReservationCounts() {
  const res = await fetch('/api/admin/reservations/counts')
  if (!res.ok) throw new Error('Failed to fetch reservation counts')
  return (await res.json()).data as ReservationCountsResponse
}
