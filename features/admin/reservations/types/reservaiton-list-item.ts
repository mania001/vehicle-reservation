import { ReservationTabId } from '../constants/reservation-tabs'

export type AdminReservationListItem = {
  id: string
  publicCode: string
  requesterName: string
  requesterPhone: string
  organization: string
  startAt: string
  endAt: string
  purpose: string
  destination: string
  status: ReservationTabId
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
