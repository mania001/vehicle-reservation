import { ReservationStatus } from './reservation-status'

export interface ReservationCreateInput {
  name: string
  organization: string
  phone: string

  startAt: Date
  endAt: Date

  purpose: string
  destination: string
}

export interface Reservation {
  id: string
  publicCode: string
  requesterName: string
  requesterPhone: string
  organization: string
  startAt: Date
  endAt: Date
  purpose: string
  destination: string
  status: ReservationStatus
  createdAt: Date
}
