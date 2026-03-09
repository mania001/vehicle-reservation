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
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getTimeAgo } from '@/lib/time'

type Props = {
  open: boolean
  item: AdminBookingItem
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>

  type?: 'issue_check' | 'canceled_check' | 'no_show_check'
}

export function IssueBottomDrawer({
  open,
  item,
  onOpenChange,
  onConfirm,
  type = 'issue_check',
}: Props) {
  const [loading, setLoading] = useState(false)

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
          <DrawerTitle>
            {type === 'issue_check' && '이슈 처리 완료'}
            {type === 'no_show_check' && '노쇼 확정'}
            {type === 'canceled_check' && '사용자 취소 확인'}
          </DrawerTitle>
          <DrawerDescription>
            {type === 'issue_check' && '반납 점검 중 차량 문제가 발견되었습니다.'}
            {type === 'no_show_check' && '사용자가 예약 시간에 차량을 사용하지 않았습니다.'}
            {type === 'canceled_check' && '사용자가 예약을 취소했습니다.'}
          </DrawerDescription>
        </DrawerHeader>

        <div className="pb-4 space-y-3 overflow-y-auto mt-4">
          <div className="bg-slate-50 rounded-2xl p-4">
            {item.reservationStatus === 'cancelled' && (
              <>
                <p className="text-[10px] font-black text-slate-400 mb-2">취소 사유</p>
                <p className="text-sm font-bold">{item.cancelReason ?? '사유 없음'}</p>
              </>
            )}
            {item.usageStatus === 'no_show' && (
              <>
                <p className="text-[10px] font-black text-slate-400 mb-2">이슈 내용</p>
                <p className="text-sm font-bold">{`${getTimeAgo(item.noShowReportedAt!)} 노쇼 처리 되었음`}</p>
              </>
            )}
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
            {loading ? '처리중...' : '완료(종료) 처리'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
