'use client'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  // DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  // SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Reservation } from '@/domains/reservation/reservation.types'
import { compressAndFormatImage } from '@/lib/image'
import {
  BatteryFull,
  Camera,
  CircleParking,
  Fuel,
  Gauge,
  ImagePlus,
  MessageSquare,
  Trash2,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { getStartDriveInfo } from '../actions/get-start-drive-info'
import { toast } from 'sonner'
import { submitReturnDrive } from '../actions/submit-return-drive'
import { useRouter } from 'next/navigation'

interface Props {
  reservation: Reservation
}

export function ReturnBottomDrawer({ reservation }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialDataLoading, setInitialDataLoading] = useState(false)

  // 출발 당시 데이터를 저장할 상태
  const [startInfo, setStartInfo] = useState<{ mileage: number; fuelLevel: number } | null>(null)

  const [mileage, setMileage] = useState(0)
  const [isFill, setIsFill] = useState(false)
  const [cost, setCost] = useState(0)
  const [fuel, setFuel] = useState([50])
  const [parkingZone, setParkingZone] = useState('')
  const [parkingNumber, setParkingNumber] = useState('')
  const [isCleaned, setIsCleaned] = useState(false)
  const [note, setNote] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([]) // 미리보기 URL 관리
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  useEffect(() => {
    if (open && reservation.usageSessionId) {
      const fetchStartInfo = async () => {
        setInitialDataLoading(true)
        const result = await getStartDriveInfo(reservation.usageSessionId ?? '')
        if (result.success && result.data) {
          setStartInfo({
            mileage: result.data.mileage ?? 0,
            fuelLevel: result.data.fuelLevel ?? 0,
          })
          // 반납 마일리지 기본값을 출발 마일리지로 세팅해주면 입력이 더 편합니다.
          setMileage(result.data.mileage ?? 0)
          setFuel([result.data.fuelLevel ?? 0])
        }
        setInitialDataLoading(false)
      }
      fetchStartInfo()
    }
  }, [open, reservation.usageSessionId])

  // 유효성 검사 (입력값이 출발 마일리지보다 작으면 안됨)
  const isMileageInvalid = startInfo && mileage > 0 && mileage < startInfo.mileage

  // 1. 유효성 검사 함수
  const validateForm = () => {
    if (startInfo?.mileage && mileage <= startInfo.mileage) {
      toast.error(`주행 거리가 이전 기록(${startInfo.mileage}km)보다 작을 수 없습니다.`)
      return false
    }

    if (startInfo?.fuelLevel && fuel[0] > startInfo.fuelLevel && !isFill) {
      toast.error(`주유를 하셨나요? 주유에 체크해주세요.`)
      return false
    }

    if (isFill && !cost) {
      toast.error(`주유 금액을 입력해주세요.`)
      return false
    }

    if (!parkingZone || !parkingNumber) {
      toast.error('주차 위치를 입력해주세요.')
      return false
    }

    if (!isCleaned) {
      toast.error(`차량 청소를 완료하고 체크 해주세요.`)
      return false
    }

    return true
  }

  async function handleSubmit() {
    if (!validateForm()) return
    setLoading(true)
    try {
      const formData = {
        usageSessionId: reservation.usageSessionId as string,
        mileage,
        fuelLevel: fuel[0],
        isFueled: isFill,
        fuelAmount: cost,
        isCleaned,
        parkingZone,
        parkingNumber,
        note,
        photos: images,
      }

      const result = await submitReturnDrive(formData)

      if (result.success) {
        toast.success('반납 처리가 완료되었습니다.')
        setOpen(false)
        router.refresh()
        // 필요 시 페이지 새로고침 또는 상태 업데이트
      } else {
        toast.error(result.error || '반납 처리 중 오류가 발생했습니다.')
      }
    } catch (error) {
      toast.error('네트워크 오류가 발생했습니다.' + error)
    } finally {
      setLoading(false)
    }
  }

  // 사진 추가 핸들러
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)

      // 유틸리티 호출: 압축 + WebP 변환
      const compressedFiles = await Promise.all(newFiles.map(file => compressAndFormatImage(file)))

      // 최대 8장 제한
      // if (images.length + newFiles.length > 8) {
      //   alert('사진은 최대 8장까지 등록 가능합니다.')
      //   return
      // }

      const newImages = [...images, ...compressedFiles].slice(0, 8)
      setImages(newImages)

      // 이전 URL들 메모리 해제 후 새로 생성 (메모리 누수 방지)
      previews.forEach(url => URL.revokeObjectURL(url))
      const newPreviews = newImages.map(file => URL.createObjectURL(file))
      setPreviews(newPreviews)
    }
  }

  // 사진 삭제
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)

    // URL 해제 및 업데이트
    URL.revokeObjectURL(previews[index])
    setPreviews(previews.filter((_, i) => i !== index))
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="flex-1 h-15 text-md shadow"
          onClick={e => {
            // setOpen(true)
            // 핵심: 클릭하는 순간 버튼의 포커스를 해제하여
            // aria-hidden이 걸린 영역 내에 포커스가 남지 않게 합니다.
            e.currentTarget.blur()
          }}
        >
          반납하기
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] px-4 pb-4">
        <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">
          <DrawerHeader className="flex-none pt-6 pb-2">
            <DrawerTitle>반납 전 차량 점검</DrawerTitle>
            <DrawerDescription>
              안전 운전 하셨나요? 반납 전 아래 내용을 작성해주세요
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-8 overflow-y-auto pt-4 pb-8">
            {/* 1. 주행 거리 */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Gauge size={18} /> 현재 주행 거리 (km)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={mileage !== 0 ? mileage : ''}
                  onChange={e => setMileage(Number(e.target.value))}
                  placeholder="0"
                  className="h-12 text-lg pr-12 text-right"
                  disabled={initialDataLoading}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">km</span>
              </div>
              {isMileageInvalid && (
                <p className="text-xs text-red-500 font-medium">
                  출발 당시({startInfo.mileage}km)보다 낮게 입력할 수 없습니다.
                </p>
              )}
            </div>

            {/* 2. 주유 (스위치) */}
            <div className="space-y-2">
              <Label className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <BatteryFull size={18} /> 주유(충전)
                </span>
                <Switch
                  className="scale-120 origin-right"
                  checked={isFill}
                  onCheckedChange={setIsFill}
                />
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={cost !== 0 ? cost : ''}
                  onChange={e => setCost(Number(e.target.value))}
                  placeholder="0"
                  className="h-12 text-lg pr-12 text-right"
                  disabled={!isFill}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                주유를 하셨다면 체크하고 영수증을 안내실에 제출 해 주세요
              </div>
            </div>

            {/* 3. 주유 상태 (슬라이더) */}
            <div className="space-y-2">
              <Label className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Fuel size={18} /> 현재 주유 상태
                </span>
                <span className="text-primary font-bold">{fuel[0]}%</span>
              </Label>
              <div className="px-2">
                <Slider value={fuel} onValueChange={setFuel} max={100} step={5} className="py-2" />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Empty (0%)</span>
                  <span>Full (100%)</span>
                </div>
              </div>
            </div>

            {/* 3. 주차 위치 */}
            <div className="space-y-2">
              <Label className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <CircleParking size={18} /> 주차 위치
                </span>
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {/* 1. 주차 층수 (Select) */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-500 ml-1">주차 층</Label>
                  <Select value={parkingZone} onValueChange={value => setParkingZone(value)}>
                    <SelectTrigger className="w-full h-12! text-lg">
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
                  <Label className="text-sm text-gray-500 ml-1">구역</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={parkingNumber}
                      onChange={e => setParkingNumber(e.target.value)}
                      placeholder="예: F구역"
                      className="h-12 text-lg text-left"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 주유 (스위치) */}
            <div className="space-y-2">
              <Label className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Trash2 size={18} /> 차량 청소
                </span>
              </Label>
              <div className="flex flex-row justify-between items-center">
                <Label htmlFor="trash-check" className="text-base text-gray-600">
                  차량 내 청소가 완료 되었을까요?
                </Label>
                <Switch
                  id="trash-check"
                  checked={isCleaned}
                  onCheckedChange={setIsCleaned}
                  className="scale-150 origin-right"
                />
              </div>
            </div>

            {/* 3. 특이사항 */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <MessageSquare size={18} /> 기타내용
              </Label>
              <Textarea
                placeholder="기타 기록 할 내용이 있나요?"
                className="h-24 resize-none"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            {/* 4. 사진 등록 (멀티 업로드) */}

            <div className="space-y-3">
              <Label className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Camera size={18} /> 차량 사진
                </span>
                <span className="text-sm font-medium text-primary">{images.length} / 8</span>
              </Label>

              <div className="flex gap-3">
                {/* 1. 추가 버튼 (고정됨) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 w-24 h-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 active:bg-gray-100 transition-colors"
                >
                  <ImagePlus size={28} />
                  <span className="text-xs mt-2 font-bold">사진 추가</span>
                </button>

                {/* 2. 이미지 미리보기 영역 (가로 스크롤) */}
                <div className="flex-1 flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
                  {previews.map((url, index) => (
                    <div
                      key={url}
                      className="relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 snap-start shadow-sm"
                    >
                      {/* Next.js Image 컴포넌트 사용 (unoptimized 설정) */}
                      <Image
                        src={url}
                        alt={`car-preview-${index}`}
                        fill
                        className="object-cover"
                        unoptimized // 로컬 blob 데이터는 최적화가 불가능하므로 해제
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white z-10"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {/* 이미지가 없을 때 가이드 텍스트 (선택사항) */}
                  {images.length === 0 && (
                    <div className="flex items-center text-gray-300 text-xs font-medium">
                      사진을 올려주세요
                    </div>
                  )}
                </div>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

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
