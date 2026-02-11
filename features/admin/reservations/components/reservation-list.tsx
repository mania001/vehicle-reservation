'use client'

import PullToRefresh from 'react-simple-pull-to-refresh'
import { useQueryClient } from '@tanstack/react-query'
import { ReservationTabId } from '../constants/reservation-tabs'
import { AdminReservationListItem } from '../types/reservaiton-list-item'
import ReservationCard from './reservation-card'
import { adminReservationQueryKeys } from '../query-keys'
import { Loader2 } from 'lucide-react'

type Props = {
  items: AdminReservationListItem[]
  emptyMessage: string
  currentTab: ReservationTabId
}

export default function ReservationList({ items, emptyMessage, currentTab }: Props) {
  const qc = useQueryClient()

  async function handleRefresh() {
    await qc.invalidateQueries({ queryKey: adminReservationQueryKeys.list(currentTab) })
    await qc.invalidateQueries({ queryKey: adminReservationQueryKeys.counts() })
  }

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
          <ReservationCard key={item.reservationId} item={item} currentTab={currentTab} />
        ))}
      </div>
    </PullToRefresh>
  )
}
