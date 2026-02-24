'use client'

import { AdminViewPager } from '@/components/admin/view-pager/admin-view-pager'
import { RESERVATION_TABS, ReservationTabId } from '../constants/reservation-tabs'
import { useAdminReservations } from '../hooks/use-admin-reservations'
import ReservationList from './reservation-list'
import { useAdminReservationCounts } from '../hooks/use-admin-reservation-counts'

export function ReservationView() {
  const countsQuery = useAdminReservationCounts()

  const tabs = RESERVATION_TABS.map(tab => ({
    ...tab,
    badgeCount: countsQuery.data?.[tab.id] ?? 0,
  }))

  return (
    <AdminViewPager<ReservationTabId>
      tabs={tabs}
      defaultTab="pending"
      render={tab => <ReservationTabContent tab={tab} />}
    />
  )
}

function ReservationTabContent({ tab }: { tab: ReservationTabId }) {
  const { data, isLoading, isError } = useAdminReservations(tab)

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
    <ReservationList
      items={data?.items ?? []}
      currentTab={tab}
      emptyMessage="해당 내용이 없습니다."
    />
  )
}
