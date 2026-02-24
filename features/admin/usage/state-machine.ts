import { AdminAction } from '../_shared/actions/admin-actions'
import { AdminBookingItem } from '../_shared/types/admin-booking-item'

export function canExecuteUsageAction(item: AdminBookingItem, action: AdminAction) {
  switch (item.usageStatus) {
    case 'scheduled':
      return action === 'check_out'

    case 'checked_out':
      return action === 'mark_returned'

    case 'returned':
      return action === 'inspect'

    case 'inspected':
    case 'no_show':
    case 'cancelled':
      return false

    default:
      return false
  }
}
