'use client'

import { Building2, FileText, MapPin, Phone, User } from 'lucide-react'
import { FormField } from './form-field'
import { ReserveFormValues, useReserveForm } from '../hooks/use-reserve-form'
import { Controller } from 'react-hook-form'
import { StickyFooter } from '@/components/common/sticky-footer'
import { createReservation } from '../actions/create-reservation'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { PhoneField } from './phone-field'
import { RangeDateTimePicker } from './range-date-time-picker'

export default function ReserveForm() {
  const router = useRouter()
  const form = useReserveForm()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  // 3. 서버 액션 제출 핸들러
  const onSubmit = async (data: ReserveFormValues) => {
    if (navigator.vibrate) navigator.vibrate(50)
    try {
      const result = await createReservation(data)
      if (result.success) {
        toast.success('예약이 완료되었습니다.')
        router.push(`/reserve/${result.publicCode}`)
      }
      //  else {
      //   toast.error(result.error)
      // }
    } catch (_) {
      toast.error('예약 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  // const submit = useServerFormAction<ReserveFormValues>(createReservation)
  return (
    <form className="space-y-5 pb-32 mt-1" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label={'이름'}
        icon={<User className="w-4 h-4 text-slate-400" />}
        placeholder={'이름을 입력하세요'}
        {...register('name')}
        error={errors.name?.message}
        hiddenLabel
      />
      <FormField
        label={'소속'}
        icon={<Building2 className="w-4 h-4 text-slate-400" />}
        placeholder={'예배당 또는 기관명을 입력하세요'}
        {...register('organization')}
        error={errors.organization?.message}
        hiddenLabel
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <PhoneField
            icon={<Phone className="w-4 h-4 text-slate-400" />}
            value={field.value}
            onChange={field.onChange} // raw 값 들어감
            placeholder={'휴대폰 번호를 입력해주세요.'}
            error={errors.phone?.message}
          />
        )}
      />

      {/* <div className="py-1 border-b border-slate-50" /> */}

      <Controller
        control={control}
        name="range"
        defaultValue={{ startAt: null, endAt: null }}
        render={({ field }) => (
          <RangeDateTimePicker label="예약 시간" value={field.value} onChange={field.onChange} />
        )}
      />

      {errors.range && <p className="text-xs text-red-500">{errors.range?.message || ''}</p>}

      {/* <div className="py-1 border-b border-slate-50" /> */}

      <FormField
        label="사용 목적"
        icon={<FileText className="w-4 h-4 text-slate-400" />}
        placeholder="사용목적 : 예) 수련회, MT, 경조사"
        {...register('purpose')}
        error={errors.purpose?.message}
        hiddenLabel
      />
      <FormField
        label="목적지"
        id="destination"
        icon={<MapPin className="w-4 h-4 text-slate-400" />}
        placeholder="목적지 : 예) OO 예배당"
        {...register('destination')}
        error={errors.destination?.message}
        hiddenLabel
      />
      <StickyFooter
        type={'submit'}
        label={isSubmitting ? '예약 중…' : '예약 신청하기'}
        disabled={isSubmitting}
      />
    </form>
  )
}
