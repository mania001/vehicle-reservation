'use client'

import { useState } from 'react'
import { InputVehicle } from '../types/input-vehicle'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Label } from '@/components/ui/label'
import {
  Cable,
  CalendarArrowUp,
  Car,
  CardSim,
  CircleParking,
  Fuel,
  Gauge,
  ToyBrick,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import {
  FUEL_TYPE_MAP,
  FuelType,
  VEHICLE_STATUS_MAP,
  VehicleStatus,
} from '@/domains/vehicle/vehicle-status'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  defaultValue?: InputVehicle
  onSubmit: (v: InputVehicle) => Promise<void>
}

export function VehicleDrawer({ open, onOpenChange, defaultValue, onSubmit }: Props) {
  const [form, setForm] = useState<InputVehicle>(
    defaultValue || {
      name: '',
      plateNumber: '',
      fuelType: 'gasoline',
      status: 'available',
      mileage: 0,
      fuelLevel: 50,
      priority: 0,
      lastParkingZone: '',
      lastParkingNumber: '',
    },
  )

  const [loading, setLoading] = useState(false)

  function setField<K extends keyof InputVehicle>(key: K, value: InputVehicle[K]) {
    setForm(v => ({
      ...v,
      [key]: value,
    }))
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      if (!form.name || !form.plateNumber) {
        alert('차량명과 번호판은 필수 입력 사항입니다.')
        return
      }
      await onSubmit(form)
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
            <DrawerTitle>{defaultValue ? '차량 수정' : '차량 등록'}</DrawerTitle>
            <DrawerDescription>차량 정보를 입력해주세요</DrawerDescription>
          </DrawerHeader>

          <div className="space-y-8 overflow-y-auto pt-4 pb-8">
            {/* 이름 */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Car size={18} /> 차량명
              </Label>
              <div className="relative">
                <Input
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="차량명을 입력하세요"
                  className="h-12 text-lg text-left"
                />
              </div>
            </div>

            {/* 번호 */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <ToyBrick size={18} /> 차량번호
              </Label>
              <div className="relative">
                <Input
                  value={form.plateNumber}
                  onChange={e => setField('plateNumber', e.target.value)}
                  placeholder="차량번호를 입력하세요 (ex. 12가 3456)"
                  className="h-12 text-lg text-left"
                />
              </div>
            </div>

            {/* 주행거리 */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Gauge size={18} /> 주행거리 (km)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={form.mileage}
                  onChange={e => setField('mileage', Number(e.target.value))}
                  placeholder="0"
                  className="h-12 text-lg pr-12 text-right"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">km</span>
              </div>
            </div>

            {/* 주유타입 */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base">
                <Cable size={18} /> 주유 타입
              </Label>

              <div className="grid grid-cols-1 gap-3">
                {/* 1. 주차 층수 (Select) */}
                <div className="space-y-1.5">
                  <Select
                    value={form.fuelType}
                    onValueChange={v => setField('fuelType', v as FuelType)}
                  >
                    <SelectTrigger className="w-full h-12! text-lg">
                      <SelectValue placeholder="주유 타입" />
                    </SelectTrigger>
                    <SelectContent className="text-lg">
                      {Object.entries(FUEL_TYPE_MAP).map(([key, value], index) => (
                        <SelectItem key={index} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 연료 */}
            <div className="space-y-2">
              <Label className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Fuel size={18} /> 연료 상태
                </span>
                <span className="text-primary font-bold">{form.fuelLevel}%</span>
              </Label>
              <div className="px-2">
                <Slider
                  value={[form.fuelLevel ?? 50]}
                  onValueChange={v => setField('fuelLevel', v[0])}
                  max={100}
                  step={5}
                  className="py-2"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Empty (0%)</span>
                  <span>Full (100%)</span>
                </div>
              </div>
            </div>

            {/* 주차 */}
            <div className="space-y-2">
              <Label className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <CircleParking size={18} /> 기본 주차 위치
                </span>
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {/* 1. 주차 층수 (Select) */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-500 ml-1">주차 층</Label>
                  <Select
                    value={form.lastParkingZone ?? ''}
                    onValueChange={v => setField('lastParkingZone', v)}
                  >
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
                      value={form.lastParkingNumber ?? ''}
                      onChange={e => setField('lastParkingNumber', e.target.value)}
                      placeholder="예: F구역"
                      className="h-12 text-lg text-left"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 우선순위 */}

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <CalendarArrowUp size={18} /> 우선순위(점수)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={form.priority}
                  onChange={e => setField('priority', Number(e.target.value))}
                  placeholder="기본값은 0입니다. 높을수록 예약 시 먼저 추천됩니다."
                  className="h-12 text-lg text-right"
                />
              </div>
              <div className="text-xs text-gray-400 mt-1 ml-1">
                우선순위가 높을수록 예약 시 먼저 추천됩니다 (기본값은 0입니다.)
              </div>
            </div>

            {/* 상태 */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base">
                <CardSim size={18} /> 차량상태
              </Label>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1.5">
                  <Select
                    value={form.status}
                    onValueChange={v => setField('status', v as VehicleStatus)}
                  >
                    <SelectTrigger className="w-full h-12! text-lg">
                      <SelectValue placeholder="차량 상태" />
                    </SelectTrigger>
                    <SelectContent className="text-lg">
                      {Object.entries(VEHICLE_STATUS_MAP).map(([key, value], index) => (
                        <SelectItem key={index} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-2 pt-2">
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="flex-1 h-12" disabled={loading}>
                취소
              </Button>
            </DrawerClose>
            <Button className="flex-2  h-12" onClick={handleSubmit} disabled={loading}>
              {loading ? '등록 중...' : defaultValue ? '수정하기' : '등록하기'}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
