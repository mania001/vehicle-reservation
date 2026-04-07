'use client'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useState } from 'react'
import { useAdminInspection } from '../hooks/use-admin-inspection'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { ImageSection } from '@/components/image-viewer/image-section'
import { CheckQuestion } from '@/components/admin/common/check-question'
import { BatteryFull, CarFront, Fuel, Gauge, MapPin, MessageSquare } from 'lucide-react'
import { Label } from '@/components/ui/label'

type Props = {
  open: boolean
  item: AdminBookingItem
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
}

export function InspectBottomDrawer({ open, item, onOpenChange, onConfirm }: Props) {
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
      <DrawerContent className="max-h-[85vh] px-4 pb-4">
        <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">
          <DrawerHeader className="flex-none pt-6 pb-2">
            <DrawerTitle>반납 차량 최종 확인</DrawerTitle>
            <DrawerDescription>반납 차량을 최종적으로 확인해주세요</DrawerDescription>
          </DrawerHeader>
          {isLoading && <div className="text-sm text-muted-foreground">정보 불러 오는 중</div>}
          {!isLoading && (
            <div className="space-y-8 overflow-y-auto pt-4 pb-8">
              <ImageSection groups={imageGroups} />

              <div className="border-t border-b-2 py-3 border-gray-200">
                <div className="font-bold text-lg my-2">반납차량 최종 정검 내용</div>
                <div className="space-y-6 mt-6">
                  <CheckQuestion
                    question={
                      <>
                        <span className="font-bold">차량 키</span>를 받으셨나요?
                      </>
                    }
                    value={returnInfo?.selections?.isReturnKey ?? null}
                    onSelect={_val => {}}
                  />
                  <CheckQuestion
                    question={
                      <>
                        <span className="font-bold">차량 청소 상태</span> 확인 하셨나요?
                      </>
                    }
                    value={returnInfo?.selections?.isCleaned ?? null}
                    onSelect={_val => {}}
                  />
                  <CheckQuestion
                    question={
                      <>
                        <span className="font-bold">주유 영수증</span>을 받으셨나요?
                      </>
                    }
                    value={returnInfo?.selections?.isFuelReceiptTaken ?? null}
                    onSelect={_val => {}}
                  />
                </div>
              </div>

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
                    <MessageSquare size={18} /> 기타내용
                  </Label>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 space-y-4 border">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 mb-2">사용 전</p>
                    <p className="text-sm font-bold">{returnInfo?.notes?.before ?? '내용 없음'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 mb-2">사용 후</p>
                    <p className="text-sm font-bold">{returnInfo?.notes?.after ?? '내용 없음'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 mb-2">관리자</p>
                    <p className="text-sm font-bold">{returnInfo?.notes?.admin ?? '내용 없음'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-row gap-2 pt-2">
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="flex-1 h-12" disabled={loading}>
                취소
              </Button>
            </DrawerClose>
            <Button className="flex-2  h-12" onClick={handleSubmit} disabled={loading}>
              {loading ? '완료 중...' : '완료하기'}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
