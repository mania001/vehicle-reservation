export const UsageStatus = {
  scheduled: 'scheduled',
  checked_out: 'checked_out',
  returned: 'returned',
  no_show: 'no_show',
  cancelled: 'cancelled',
} as const

export type UsageStatus = (typeof UsageStatus)[keyof typeof UsageStatus]
