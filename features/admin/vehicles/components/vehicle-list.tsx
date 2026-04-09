'use client'

import PullToRefresh from 'react-simple-pull-to-refresh'
import { VehicleListItem } from '../types/vehicle-list-item'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { VehicleCard } from './vehicle-card'
import { CreateVehicleFab } from './create-vehicle-fab'

type Props = {
  items: VehicleListItem[]
  emptyMessage: string
}

export default function VehicleList({ items, emptyMessage }: Props) {
  const qc = useQueryClient()

  async function handleRefresh() {
    await qc.invalidateQueries({ queryKey: ['admin-vehicles'] })
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
      <div className="p-2 space-y-4">
        {items.map(v => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>

      <CreateVehicleFab />
    </PullToRefresh>
  )
}
