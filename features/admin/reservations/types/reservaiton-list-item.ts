import { ReservationTabId } from '../constants/reservation-tabs'

export type AdminReservationListItem = {
  reservationId: string
  publicCode: string
  status: ReservationTabId
  requesterName: string
  requesterPhone: string
  organization: string
  purpose: string
  destination: string
  startAt: string
  endAt: string
  isLate?: boolean
  usageStatus?: string | null
  reservationStatus?: string | null
  vehicle?: {
    name: string
    plateNumber: string
  } | null
  createdAt: string
}

export type ReservationCountsResponse = Record<ReservationTabId, number>
