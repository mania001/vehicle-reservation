export const USAGE_TABS = [
  { id: 'key_out', label: '키배출' },
  { id: 'driving', label: '운행중' },
  // { id: 'return_wait', label: '반납대기' },
  { id: 'returned', label: '반납처리' },
  // { id: 'done', label: '완료' },
] as const

export type UsageTabId = (typeof USAGE_TABS)[number]['id']

export const DEFAULT_USAGE_TAB: UsageTabId = 'key_out'

export function isUsageTabId(value: string): value is UsageTabId {
  return USAGE_TABS.some(tab => tab.id === value)
}
