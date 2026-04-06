'use client'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { ImageSection } from '@/components/image-viewer/image-section'
import { Label } from '@/components/ui/label'
import { Fuel, Gauge, MapPin, MessageSquare } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CheckQuestion } from '@/components/admin/common/check-question'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ImageUpload } from '@/components/image-upload/image-upload'
import { useDriverReturn } from '../hooks/use-driver-return'
import { toast } from 'sonner'
import { InspectUsagePayload, SelectionState } from '../api/inspect-usage'

export function ReturnBottomDrawer({
  reservation,
  open,
  onConfirm,
  onOpenChange,
}: {
  reservation: AdminBookingItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (payload: Omit<InspectUsagePayload, 'usageSessionId'>) => Promise<void>
}) {
  const [loading, setLoading] = useState(false)
  const { data: returnInfo, isLoading } = useDriverReturn({
    usageSessionId: reservation!.usageSessionId,
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
  ]

  // 사용자가 입력한 값을 초기값으로 설정하여 관리자의 입력을 최소화함
  const [finalMileage, setFinalMileage] = useState(0)
  const [finalFuel, setFinalFuel] = useState([0])
  const [parkingZone, setParkingZone] = useState('')
  const [parkingNumber, setParkingNumber] = useState('')
  const [note, setNote] = useState('')
  const [issue, setIssue] = useState(false)
  const [images, setImages] = useState<File[]>([])

  async function handleSubmit() {
    setLoading(true)
    try {
      const isNullSelection = Object.values(selections).some(value => value === null)

      if (isNullSelection) {
        toast.error('반납 최종 점검을 해주세요')
        return
      }

      await onConfirm({
        mileage: finalMileage,
        fuelLevel: finalFuel[0],
        parkingZone,
        parkingNumber,
        isCleaned: selections.isCleaned!,
        note,
        images,
        issue,
        selections,
      })
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  // 상태 관리 (이미지처럼 '네'가 기본 선택된 느낌을 위해 초기값 설정 가능)
  const [selections, setSelections] = useState<SelectionState>({
    isReturnKey: null,
    isCleaned: null,
    isFuelReceiptTaken: null,
  })

  useEffect(() => {
    if (returnInfo) {
      setFinalMileage(returnInfo.mileage)
      setFinalFuel([returnInfo.fuelLevel])
      setParkingZone(returnInfo.parkingZone)
      setParkingNumber(returnInfo.parkingNumber)
      // setSelections(p => ({
      //   ...p,
      //   isCleaned: returnInfo.isCleaned,
      //   isFuelReceiptTaken: returnInfo.isFueled,
      // }))
    }
  }, [returnInfo])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] px-4 pb-4">
        <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">
          <DrawerHeader className="flex-none pt-6 pb-2">
            <DrawerTitle>반납 차량 점검</DrawerTitle>
            <DrawerDescription>차량이 정상적으로 반납되었는지 확인해주세요.</DrawerDescription>
          </DrawerHeader>
          {isLoading && <div className="text-sm text-muted-foreground">정보 불러 오는 중</div>}
          {!isLoading && (
            <div className="space-y-8 overflow-y-auto pt-4 pb-8">
              <ImageSection groups={imageGroups} />

              <div className="border-t border-b-2 py-3 border-gray-200">
                <div className="font-bold text-lg my-2">반납차량 최종 정검</div>
                <div className="space-y-6 mt-6">
                  <CheckQuestion
                    question={
                      <>
                        <span className="font-bold">차량 키</span>를 받으셨나요?
                      </>
                    }
                    value={selections.isReturnKey}
                    onSelect={val => setSelections(p => ({ ...p, isReturnKey: val }))}
                  />
                  <CheckQuestion
                    question={
                      <>
                        <span className="font-bold">차량 청소 상태</span> 확인 하셨나요?
                      </>
                    }
                    value={selections.isCleaned}
                    onSelect={val => setSelections(p => ({ ...p, isCleaned: val }))}
                  />
                  <CheckQuestion
                    question={
                      <>
                        <span className="font-bold">주유 영수증</span>을 받으셨나요?
                      </>
                    }
                    value={selections.isFuelReceiptTaken}
                    onSelect={val => setSelections(p => ({ ...p, isFuelReceiptTaken: val }))}
                  />
                </div>
              </div>

              {/* 마일리지 */}
              <div className="p-4 bg-gray-50 rounded-2xl space-y-3 border">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Gauge size={16} />
                    주행거리
                  </span>
                  <span className="font-bold">{returnInfo?.mileage} km</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border-2 border-blue-100 shadow-sm">
                  <Label className="shrink-0 text-xs font-bold text-primary pl-2">최종</Label>
                  <Input
                    type="number"
                    value={finalMileage}
                    onChange={e => setFinalMileage(Number(e.target.value))}
                    className="border-none shadow-none text-right text-lg h-10 font-bold focus-visible:ring-0 text-primary"
                  />
                  <span className="text-sm text-gray-400 pr-2 font-medium">km</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl space-y-4 border">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Fuel size={16} />
                    연료량
                  </span>
                  <span className="font-bold">{returnInfo?.fuelLevel}%</span>
                </div>
                <div className="space-y-1 bg-white p-4 rounded-xl border shadow-sm">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-primary">최종 연료량</Label>
                    <span className="text-lg font-black text-primary">{finalFuel[0]}%</span>
                  </div>
                  <Slider
                    value={finalFuel}
                    onValueChange={setFinalFuel}
                    max={100}
                    step={5}
                    className="py-2"
                  />
                </div>
              </div>

              {/* 주차 위치 */}
              <div className="p-4 bg-gray-50 rounded-2xl space-y-3 border">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <MapPin size={16} />
                    주차 위치
                  </span>
                  <span className="font-bold text-primary">
                    {returnInfo?.parkingZone} {returnInfo?.parkingNumber}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {/* 1. 주차 층수 (Select) */}
                  <div className="space-y-1.5">
                    <Select value={parkingZone} onValueChange={value => setParkingZone(value)}>
                      <SelectTrigger className="w-full h-12! text-lg bg-white">
                        <SelectValue placeholder="층 선택" />
                      </SelectTrigger>
                      <SelectContent className="text-lg">
                        <SelectItem value="B1">지하 1층</SelectItem>
                        <SelectItem value="B2">지하 2층</SelectItem>
                        <SelectItem value="B3">지하 3층</SelectItem>
                        <SelectItem value="B4">지하 4층</SelectItem>
                        <SelectItem value="1F">지상 1층</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 2. 구역 번호 (Input) */}
                  <div className="space-y-1.5 col-span-2">
                    <div className="relative">
                      <Input
                        type="text"
                        value={parkingNumber}
                        onChange={e => setParkingNumber(e.target.value)}
                        placeholder="예: F구역"
                        className="h-12 text-lg text-left bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 3. 특이사항 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-base">
                  <Label className="flex items-center gap-2">
                    <MessageSquare size={18} /> 기타내용 (이슈내용 기록)
                  </Label>
                  <div className="flex space-x-3">
                    <Label>이슈체크</Label>
                    <Switch
                      className="scale-120 origin-right"
                      checked={issue}
                      onCheckedChange={setIssue}
                    />
                  </div>
                </div>
                <Textarea
                  placeholder={` ${issue ? '이슈 내용을 입력해주세요.' : `기타 기록 할 내용이 있나요?`}`}
                  className="h-24 resize-none"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
                {returnInfo?.note && (
                  <p className="text-sm text-muted-foreground">사용자 입력: {returnInfo?.note}</p>
                )}
              </div>

              <ImageUpload max={8} value={images} label="차량 사진" onChange={setImages} />
            </div>
          )}

          <div className="flex flex-row gap-2 pt-2">
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="flex-1 h-12" disabled={loading}>
                취소
              </Button>
            </DrawerClose>
            <Button className="flex-2  h-12" onClick={handleSubmit} disabled={loading}>
              {loading ? '등록 중...' : '등록하기'}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
