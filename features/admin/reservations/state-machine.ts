import { AdminAction } from '../_shared/actions/admin-actions'
import { AdminBookingItem } from '../_shared/types/admin-booking-item'

export function canExecuteReservationAction(item: AdminBookingItem, action: AdminAction) {
  switch (item.reservationStatus) {
    case 'pending':
      return action === 'approve' || action === 'reject'

    case 'approved':
      return false

    case 'rejected':
    case 'cancelled':
    case 'closed':
      return false

    default:
      return false
  }
}
