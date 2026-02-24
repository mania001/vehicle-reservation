'use client'

import { AdminViewPager } from '@/components/admin/view-pager/admin-view-pager'
import { USAGE_TABS, UsageTabId } from '../constants/usage-tabs'
import { useAdminUsageCounts } from '../hooks/use-admin-usage-counts'
import { useAdminUsageList } from '../hooks/use-admin-usage-list'
import UsageList from './usage-list'

export function UsageView() {
  const countsQuery = useAdminUsageCounts()

  const tabs = USAGE_TABS.map(tab => ({
    ...tab,
    badgeCount: countsQuery.data?.[tab.id] ?? 0,
  }))

  return (
    <AdminViewPager<UsageTabId>
      tabs={tabs}
      defaultTab="key_out"
      render={tab => <UsageTabContent tab={tab} />}
    />
  )
}

function UsageTabContent({ tab }: { tab: UsageTabId }) {
  const { data, isLoading, isError } = useAdminUsageList(tab)

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-semibold text-rose-600">데이터를 불러오지 못했습니다.</p>
      </div>
    )
  }

  return (
    <UsageList items={data?.items ?? []} currentTab={tab} emptyMessage="해당 내용이 없습니다." />
  )
}
