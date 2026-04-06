'use client'

import { toast } from 'sonner'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { UsageTabId } from '../constants/usage-tabs'
import { useEffect, useState } from 'react'
import {
  AdminAction,
  AdminDomainState,
  getTransition,
} from '../../_shared/model/admin-state-machine'
import { CheckOutBottomDrawer } from './check-out-bottom-drawer'
import { useCheckOutMutation } from '../mutations/use-check-out-mutation'
import { NoShowBottomDrawer } from './no-show-bottom-drawer'
import { useNoShowMutation } from '../mutations/use-no-show-mutaion'
import { ReturnBottomDrawer } from './return-buttom-drawer'
import { useInspectMutation } from '../mutations/use-inspect-mutation'

type Props = {
  action: AdminAction | null
  item: AdminBookingItem | null
  clear: () => void
  currentTab: UsageTabId
}

export function UsageActionDispatcher({ action, item, clear, currentTab }: Props) {
  const [drawer, setDrawer] = useState<AdminAction | null>(null)

  const checkOutMutation = useCheckOutMutation(currentTab)
  const noShowMutation = useNoShowMutation(currentTab)
  const inspectMutation = useInspectMutation(currentTab)

  // ✅ transition은 안전하게 계산
  const transition =
    action && item
      ? getTransition(
          {
            reservationStatus: item.reservationStatus,
            usageStatus: item.usageStatus,
            vehicle: item.vehicle,
          } as AdminDomainState,
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
      {drawer === 'check_out' && (
        <CheckOutBottomDrawer
          reservation={item}
          open
          onOpenChange={() => {
            setDrawer(null)
            clear()
          }}
          onConfirm={async () => {
            await checkOutMutation.mutateAsync({
              usageSessionId: item.usageSessionId,
            })
            setDrawer(null)
            clear()
          }}
        />
      )}

      {drawer === 'no_show' && (
        <NoShowBottomDrawer
          reservation={item}
          open
          onOpenChange={() => {
            setDrawer(null)
            clear()
          }}
          onConfirm={async () => {
            await noShowMutation.mutateAsync({
              usageSessionId: item.usageSessionId,
            })
            setDrawer(null)
            clear()
          }}
        />
      )}

      {drawer === 'mark_returned' && (
        <ReturnBottomDrawer
          reservation={item}
          open
          onOpenChange={() => {
            setDrawer(null)
            clear()
          }}
          onConfirm={async ({
            mileage,
            fuelLevel,
            parkingZone,
            parkingNumber,
            isCleaned,
            note,
            images,
            issue,
            selections,
          }) => {
            await inspectMutation.mutateAsync({
              usageSessionId: item.usageSessionId,
              mileage,
              fuelLevel,
              parkingZone,
              parkingNumber,
              isCleaned,
              note,
              images,
              issue,
              selections,
            })

            setDrawer(null)
            clear()
          }}
        />
      )}
    </>
  )
}
