'use client'

import { toast } from 'sonner'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { UsageTabId } from '../constants/usage-tabs'
import { useEffect, useState } from 'react'
import { AdminAction, getTransition } from '../../_shared/model/admin-state-machine'

type Props = {
  action: AdminAction | null
  item: AdminBookingItem | null
  clear: () => void
  currentTab: UsageTabId
}

export function UsageActionDispatcher({ action, item, clear }: Props) {
  const [drawer, setDrawer] = useState<AdminAction | null>(null)

  // ✅ transition은 안전하게 계산
  const transition =
    action && item
      ? getTransition(
          {
            reservationStatus: item.reservationStatus,
            usageStatus: item.usageStatus,
          },
          action,
        )
      : null

  // ✅ Hook은 항상 호출된다 (조건문 안 아님)
  useEffect(() => {
    if (!action || !item) return

    if (!transition) {
      toast.error('현재 상태에서 실행할 수 없는 작업입니다.')
      clear()
      return
    }

    if (transition.requiresDrawer) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      setDrawer(action)
    } else {
      executeDirectAction(action)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action])

  async function executeDirectAction(action: AdminAction) {
    try {
      switch (action) {
        default:
          break
      }
    } finally {
      clear()
    }
  }

  if (!action || !item) return null

  return (
    <>
      {drawer === 'check_out' && <div>체크아웃 드로어</div>}
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
