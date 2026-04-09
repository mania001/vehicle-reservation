'use client'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getTimeAgo } from '@/lib/time'
import { useAdminInspection } from '../hooks/use-admin-inspection'
import { BatteryFull, CarFront, Fuel, Gauge, MapPin, MessageSquare } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { ImageSection } from '@/components/image-viewer/image-section'

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

  const { data: returnInfo, isLoading } = useAdminInspection({
    usageSessionId: item!.usageSessionId,
  })

  const imageGroups = [
    {
      key: ' before',
      label: '사용전 사진',
      images: returnInfo?.photos.before || [],
    },
    {
      key: 'after',
      label: '사용후 사진',
      images: returnInfo?.photos.after || [],
    },
    {
      key: 'admin',
      label: '관리자 사진',
      images: returnInfo?.photos.admin || [],
    },
  ]

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
        <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">
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
          {type === 'issue_check' && isLoading && (
            <div className="text-sm text-muted-foreground">정보 불러 오는 중</div>
          )}
          <div className="pb-4 space-y-3 overflow-y-auto mt-4">
            {type !== 'issue_check' ? (
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
            ) : (
              <>
                <ImageSection groups={imageGroups} />
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-base">
                    <Label className="flex items-center gap-2">
                      <CarFront size={18} /> 반납 차량 정보
                    </Label>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl space-y-4 border">
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Gauge size={16} />
                        주행거리
                      </span>
                      <div className="font-bold space-x-3">
                        <span className="text-xs text-gray-400">
                          현재 : {returnInfo?.mileages?.admin} km
                        </span>
                        <span>{returnInfo?.mileages?.driving} km</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Fuel size={16} />
                        연료량
                      </span>
                      <span className="font-bold">{returnInfo?.fuelLevel}%</span>
                    </div>
                    {returnInfo?.fuel?.is_fueled && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2 text-gray-500">
                          <BatteryFull size={16} />
                          주유(충전)
                        </span>
                        <span className="font-bold">{returnInfo?.fuel?.fuel_amount} 원</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <MapPin size={16} />
                        주차 위치
                      </span>
                      <span className="font-bold">
                        {returnInfo?.parkingZone} {returnInfo?.parkingNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-base">
                    <Label className="flex items-center gap-2">
                      <MessageSquare size={18} /> 기타내용(이슈내용)
                    </Label>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-4 border">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-2">사용 전</p>
                      <p className="text-sm font-bold">
                        {returnInfo?.notes?.before === '' ? '내용 없음' : returnInfo?.notes?.before}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-2">사용 후</p>
                      <p className="text-sm font-bold">
                        {returnInfo?.notes?.after === '' ? '내용 없음' : returnInfo?.notes?.after}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-2">관리자(이슈내용)</p>
                      <p className="text-sm font-bold">
                        {returnInfo?.notes?.admin === '' ? '내용 없음' : returnInfo?.notes?.admin}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-row gap-2 pt-2">
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
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
