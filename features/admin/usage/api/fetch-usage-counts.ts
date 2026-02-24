import { UsageCountsResponse } from '../types/usage-list-item'

export async function fetchUsageCounts(): Promise<UsageCountsResponse> {
  const res = await fetch('/api/admin/usage/counts', {
    method: 'GET',
    cache: 'no-store',
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.error?.message ?? 'Failed to fetch usage counts')
  }

  return json.data as UsageCountsResponse
}
