export const ReservationStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  CLOSED: 'closed',
} as const

export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus]
