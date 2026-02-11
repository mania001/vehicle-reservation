export const UsageStatus = {
  SCHEDULED: 'scheduled',
  CHECKED_OUT: 'checked_out',
  RETURNED: 'returned',
  INSPECTED: 'inspected',
  NO_SHOW: 'no_show',
  CANCELLED: 'cancelled',
} as const

export type UsageStatus = (typeof UsageStatus)[keyof typeof UsageStatus]
