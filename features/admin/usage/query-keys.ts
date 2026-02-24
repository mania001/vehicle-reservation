import { UsageTabId } from './constants/usage-tabs'

export const adminUsageQueryKeys = {
  all: () => ['admin-usages'] as const,
  list: (tab: UsageTabId) => ['admin-usages', tab] as const,
  counts: () => ['admin-usage-counts'] as const,
}
