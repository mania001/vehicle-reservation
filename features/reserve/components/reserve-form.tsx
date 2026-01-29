'use client'

import { Building2, FileText, MapPin, User } from 'lucide-react'
import { FormField } from './form-field'
import { MobileDateTimePicker } from './mobile-date-picker'
import { useState } from 'react'
import { addHours, isBefore } from 'date-fns'

export default function ReserveForm() {
  const [startTime, setStartTime] = useState<Date | undefined>(undefined)
  const [endTime, setEndTime] = useState<Date | undefined>(undefined)

  // 시작 시간 변경 시 로직
  const handleStartTimeChange = (date: Date | undefined) => {
    setStartTime(date)

    // 종료 시간이 없거나, 시작 시간보다 빠르다면 자동으로 시작 시간 +1시간 뒤로 설정
    if (date && (!endTime || isBefore(endTime, date))) {
      setEndTime(addHours(date, 1))
    }
  }

  return (
    <form className="space-y-5 pb-32">
      <FormField
        label={'이름'}
        id={'name'}
        icon={<User className="w-4 h-4 text-slate-400" />}
        placeholder={'이름을 입력하세요'}
      />
      <FormField
        label={'소속'}
        id={'dept'}
        icon={<Building2 className="w-4 h-4 text-slate-400" />}
        placeholder={'소속 또는 부서명을 입력하세요'}
      />
      <FormField
        label={'연락처'}
        id={'phone'}
        type="tel"
        icon={<User className="w-4 h-4 text-slate-400" />}
        placeholder={'휴대폰 번호를 입력해주세요.'}
      />

      <div className="py-2 border-b border-slate-50" />

      <div className="grid grid-cols-1 gap-4">
        <MobileDateTimePicker
          label="예약 시작 시간"
          value={startTime}
          onChange={handleStartTimeChange}
          variant="start"
        />
        <MobileDateTimePicker
          label="예약 종료 시간"
          value={endTime}
          onChange={setEndTime}
          minDate={startTime} // 시작 시간 이전 날짜는 선택 불가
          variant="end"
        />
      </div>

      <div className="py-1 border-b border-slate-50" />

      <FormField
        label="사용 목적"
        id="purpose"
        icon={<FileText className="w-4 h-4 text-slate-400" />}
        placeholder="예: 수련회, MT, 경조사"
      />

      <FormField
        label="목적지"
        id="destination"
        icon={<MapPin className="w-4 h-4 text-slate-400" />}
        placeholder="예: OO 예배당"
      />
    </form>
  )
}
