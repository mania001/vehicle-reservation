import { ReservationTabId } from './constants/reservation-tabs'

export const adminReservationQueryKeys = {
  all: () => ['admin-reservations'] as const,
  list: (tab: ReservationTabId) => ['admin-reservations', tab] as const,
  counts: () => ['admin-reservation-counts'] as const,
}
