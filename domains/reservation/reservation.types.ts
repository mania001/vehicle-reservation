import { UsageStatus } from '../usage-session/usage-status'
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

  usageSessionId?: string | null
  usageStatus: UsageStatus | null

  vehicle?: {
    id: string
    name: string
    plateNumber: string
    fuelLevel?: string
    fuelType?: string
  } | null
}
