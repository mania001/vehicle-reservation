'use client'

import { Building2, FileText, MapPin, User } from 'lucide-react'
import { FormField } from './form-field'
import { MobileDateTimePicker } from './mobile-date-picker'
import { addHours } from 'date-fns'
import { ReserveFormValues, useReserveForm } from '../hooks/use-reserve-form'
import { Controller } from 'react-hook-form'
import { StickyFooter } from '@/components/common/sticky-footer'
import { createReservation } from '../actions/create-reservation'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ReserveForm() {
  const router = useRouter()
  const form = useReserveForm()
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form

  const startAt = watch('startAt')
  const endAt = watch('endAt')

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
    <form className="space-y-5 pb-32" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label={'이름'}
        icon={<User className="w-4 h-4 text-slate-400" />}
        placeholder={'이름을 입력하세요'}
        {...register('name')}
        error={errors.name?.message}
      />
      <FormField
        label={'소속'}
        icon={<Building2 className="w-4 h-4 text-slate-400" />}
        placeholder={'소속 또는 부서명을 입력하세요'}
        {...register('organization')}
        error={errors.organization?.message}
      />
      <FormField
        label={'연락처'}
        type="tel"
        icon={<User className="w-4 h-4 text-slate-400" />}
        placeholder={'휴대폰 번호를 입력해주세요.'}
        {...register('phone')}
        error={errors.phone?.message}
      />

      <div className="py-2 border-b border-slate-50" />

      <Controller
        name="startAt"
        control={control}
        render={({ field }) => (
          <MobileDateTimePicker
            label="예약 시작 시간"
            value={field.value}
            onChange={date => {
              field.onChange(date)
              if (endAt && date && endAt < date) {
                setValue('endAt', addHours(date, 1))
              }
            }}
            variant="start"
          />
        )}
      />
      {errors.startAt && <p className="text-xs text-red-500 ml-1">{errors.startAt.message}</p>}

      <Controller
        control={control}
        name="endAt"
        render={({ field }) => (
          <MobileDateTimePicker
            label="예약 종료 시간"
            value={field.value}
            onChange={field.onChange}
            minDate={startAt}
            variant="end"
          />
        )}
      />
      {errors.endAt && <p className="text-xs text-red-500 ml-1">{errors.endAt.message}</p>}

      <div className="py-1 border-b border-slate-50" />

      <FormField
        label="사용 목적"
        icon={<FileText className="w-4 h-4 text-slate-400" />}
        placeholder="예: 수련회, MT, 경조사"
        {...register('purpose')}
        error={errors.purpose?.message}
      />

      <FormField
        label="목적지"
        id="destination"
        icon={<MapPin className="w-4 h-4 text-slate-400" />}
        placeholder="예: OO 예배당"
        {...register('destination')}
        error={errors.destination?.message}
      />

      <StickyFooter
        type={'submit'}
        label={isSubmitting ? '예약 중…' : '예약 신청하기'}
        disabled={isSubmitting}
      />
    </form>
  )
}
