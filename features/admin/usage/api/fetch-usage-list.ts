import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { UsageTabId } from '../constants/usage-tabs'

export async function fetchUsageList(tab: UsageTabId): Promise<{ items: AdminBookingItem[] }> {
  const res = await fetch(`/api/admin/usage?tab=${tab}`, {
    method: 'GET',
    cache: 'no-store',
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.error?.message ?? 'Failed to fetch usage list')
  }

  return json.data ?? { items: [] }
}
