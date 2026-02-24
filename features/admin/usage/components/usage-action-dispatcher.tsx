'use client'

import { toast } from 'sonner'
import { AdminAction } from '../../_shared/actions/admin-actions'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { UsageTabId } from '../constants/usage-tabs'
import { canExecuteUsageAction } from '../state-machine'
import { useState } from 'react'

type Props = {
  action: AdminAction | null
  item: AdminBookingItem | null
  clear: () => void
  currentTab: UsageTabId
}

export function UsageActionDispatcher({ action, item, clear }: Props) {
  const [drawer, setDrawer] = useState<AdminAction | null>(null)

  if (!action || !item) return null

  // 🔥 상태 전이 1차 검증
  if (!canExecuteUsageAction(item, action)) {
    toast.error('현재 상태에서 실행할 수 없는 작업입니다.')
    clear()
    return null
  }

  // Drawer 필요한 액션 결정
  if (action === 'check_out' || action === 'mark_returned' || action === 'inspect') {
    if (drawer !== action) {
      setDrawer(action)
    }
  }

  return (
    <>
      {/* {drawer === 'check_out' && (
        <CheckOutBottomDrawer
          open
          onOpenChange={() => {
            setDrawer(null)
            clear()
          }}
          onConfirm={async payload => {
            await checkOutMutation.mutateAsync({
              usageId: item.usageId,
              ...payload,
            })
            setDrawer(null)
            clear()
          }}
        />
      )} */}

      {/* {drawer === 'mark_returned' && (
        <ReturnBottomDrawer
          open
          onOpenChange={() => {
            setDrawer(null)
            clear()
          }}
          onConfirm={async payload => {
            await returnMutation.mutateAsync({
              usageId: item.usageId,
              ...payload,
            })
            setDrawer(null)
            clear()
          }}
        />
      )} */}

      {/* {drawer === 'inspect' && (
        <InspectBottomDrawer
          open
          onOpenChange={() => {
            setDrawer(null)
            clear()
          }}
          onConfirm={async payload => {
            await inspectMutation.mutateAsync({
              usageId: item.usageId,
              ...payload,
            })
            setDrawer(null)
            clear()
          }}
        />
      )} */}
    </>
  )
}
