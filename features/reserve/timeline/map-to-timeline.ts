import { ReservationStatus } from '@/domains/reservation/reservation-status'
import { UsageStatus } from '@/domains/usage-session/usage-status'
import { TimelineStatus } from './timeline.types'

export function mapToTimelineStatus(
  reservationStatus: ReservationStatus,
  usageStatus?: UsageStatus | null,
): TimelineStatus {
  if (reservationStatus === 'pending') return 'pending'
  if (reservationStatus === 'approved' && !usageStatus) return 'approved'

  if (usageStatus === 'checked_out') return 'in_use'
  if (usageStatus === 'returned' || usageStatus === 'no_show') return 'completed'

  return 'approved'
}
