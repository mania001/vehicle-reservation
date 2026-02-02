export const ReservationStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
} as const

export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus]
