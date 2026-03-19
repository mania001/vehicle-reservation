import { ReservationStatus } from '@/domains/reservation/reservation-status'
import { UsageStatus } from '@/domains/usage-session/usage-status'

export function getReservationStep(
  reservationStatus: ReservationStatus,
  usageStatus?: UsageStatus,
) {
  if (reservationStatus === 'pending') return 0

  if (reservationStatus === 'approved') {
    if (usageStatus === 'scheduled') return 1
    if (usageStatus === 'checked_out') return 2
    if (usageStatus === 'returned') return 3
    if (usageStatus === 'inspected') return 4
  }

  if (reservationStatus === 'closed') return 4

  if (reservationStatus === 'rejected') return 5
  if (reservationStatus === 'cancelled') return 6

  return 0
}

export const RESERVATION_STEPS = [
  { label: '예약접수' },
  { label: '예약승인' },
  { label: '차량사용' },
  { label: '반납처리' },
  { label: '이용완료' },
]
