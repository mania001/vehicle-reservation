// import { ReservationStatus } from './reservation-status'

export interface ReservationCreateInput {
  name: string
  organization: string
  phone: string

  startAt: Date
  endAt: Date

  purpose: string
  destination: string
}
