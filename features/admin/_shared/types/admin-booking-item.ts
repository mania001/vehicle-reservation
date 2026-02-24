export type AdminBookingItem = {
  reservationId: string
  publicCode: string

  reservationStatus: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'closed'
  usageStatus:
    | 'scheduled'
    | 'checked_out'
    | 'returned'
    | 'inspected'
    | 'no_show'
    | 'cancelled'
    | null

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
