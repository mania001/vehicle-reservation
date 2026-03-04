'use client'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { UserInformation } from '../../_shared/components/user-information'
import { ReservationPeriod } from '../../_shared/components/reservation-period'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { getElapsedMinutes, getNoShowMessage } from '@/lib/time'
import { cn } from '@/lib/utils'

export function NoShowBottomDrawer({
  reservation,
  open,
  onOpenChange,
  onConfirm,
}: {
  reservation: AdminBookingItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
}) {
  const [loading, setLoading] = useState(false)

  const elapsedMin = getElapsedMinutes(reservation.startAt)
  const isNoShowReportable = elapsedMin >= 30

  async function handleSubmit() {
    setLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] px-4 pb-8">
        <DrawerHeader>
          <DrawerTitle>노쇼 처리</DrawerTitle>
          <DrawerDescription>
            {reservation.requesterName}님이 예약 시간에 나타나지 않았을까요?
          </DrawerDescription>
        </DrawerHeader>
        <div className="pb-4 space-y-3 overflow-y-auto mt-4">
          <UserInformation item={reservation} />

          {/* 일정 */}
          <ReservationPeriod item={reservation} />

          <div
            className={cn(
              'pt-3 text-sm text-center',
              isNoShowReportable ? 'text-red-500' : 'text-yellow-500',
            )}
          >
            {isNoShowReportable
              ? `예약 시작시간으로부터 ${getNoShowMessage(reservation.startAt)} 하여 노쇼 처리 해주세요.`
              : `아직 시작한 지 ${elapsedMin}분 밖에 되지 않았습니다. (30분 경과 후 가능)`}
          </div>
        </div>

        <DrawerFooter className="flex w-full flex-row justify-between gap-2 px-0 mt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>

          <Button
            type="button"
            className="flex-1 font-bold"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? '처리중...' : '노쇼 처리'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
