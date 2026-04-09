import { ReservationStatus } from '@/domains/reservation/reservation-status'
import { UsageStatus } from '@/domains/usage-session/usage-status'

export type AdminBookingItem = {
  reservationId: string
  publicCode: string

  reservationStatus: ReservationStatus
  usageSessionId: string
  usageStatus: UsageStatus | null

  requesterName: string
  organization: string | null
  requesterPhone: string

  purpose: string
  destination: string

  startAt: string
  endAt: string

  cancelReason?: string
  noShowReportedAt?: string

  vehicle?: {
    id: string
    name: string
    plateNumber: string
    fuelLevel?: string
    fuelType?: string
  } | null

  hasIssue?: boolean // usageStatus가 'returned'인 경우, 점검 결과 이슈 여부
  createdAt: string
}
