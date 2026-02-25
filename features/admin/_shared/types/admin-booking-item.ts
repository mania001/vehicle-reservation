import { ReservationStatus } from '@/domains/reservation/reservation-status'
import { UsageStatus } from '@/domains/usage-session/usage-status'

export type AdminBookingItem = {
  reservationId: string
  publicCode: string

  reservationStatus: ReservationStatus
  usageStatus: UsageStatus | null

  requesterName: string
  organization: string | null
  requesterPhone: string

  purpose: string
  destination: string

  startAt: string
  endAt: string

  vehicle?: {
    name: string
    plateNumber: string
  } | null

  createdAt: string
}
