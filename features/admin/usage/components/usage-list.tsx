'use client'

import { useQueryClient } from '@tanstack/react-query'
import { UsageTabId } from '../constants/usage-tabs'
import { adminUsageQueryKeys } from '../query-keys'
import PullToRefresh from 'react-simple-pull-to-refresh'
import { Loader2 } from 'lucide-react'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { AdminBookingCard } from '../../_shared/components/admin-booking-card'
import { useAdminActionDispatcher } from '../../_shared/actions/use-admin-action-dispatcher'
import { UsageActionDispatcher } from './usage-action-dispatcher'

type Props = {
  items: AdminBookingItem[]
  emptyMessage: string
  currentTab: UsageTabId
}

export default function UsageList({ items, emptyMessage, currentTab }: Props) {
  const qc = useQueryClient()

  async function handleRefresh() {
    await qc.invalidateQueries({ queryKey: adminUsageQueryKeys.list(currentTab) })
    await qc.invalidateQueries({ queryKey: adminUsageQueryKeys.counts() })
  }

  const { selectedItem, pendingAction, dispatch, clear } = useAdminActionDispatcher()

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <p className="text-sm font-semibold text-slate-500">{emptyMessage}</p>
        <p className="text-xs text-slate-400 mt-2">현재 처리할 항목이 없습니다.</p>
      </div>
    )
  }

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      pullingContent={
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin opacity-60" />
          아래로 당겨 새로고침
        </div>
      }
      refreshingContent={
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          새로고침 중...
        </div>
      }
    >
      <div className="p-4 space-y-6">
        {items.map(item => (
          <AdminBookingCard key={item.reservationId} item={item} onAction={dispatch} />
        ))}

        <UsageActionDispatcher
          action={pendingAction}
          item={selectedItem}
          clear={clear}
          currentTab={currentTab}
        />
      </div>
    </PullToRefresh>
  )
}
