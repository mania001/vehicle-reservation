'use client'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useState } from 'react'
import { FormField } from './form-field'
import { Phone, User } from 'lucide-react'
import { useDriverForm } from '../hooks/use-driver-form'
import { DriverFormValues } from '../schema/driver-schema'
import { toast } from 'sonner'
import { updateDriverInfo } from '../actions/update-driver-info'
import { Reservation } from '@/domains/reservation/reservation.types'

interface Props {
  reservation: Reservation
}

export function DriverBottomDrawer({ reservation }: Props) {
  const [open, setOpen] = useState(false)

  const form = useDriverForm()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  // 3. 서버 액션 제출 핸들러
  const onSubmit = async (data: DriverFormValues) => {
    if (navigator.vibrate) navigator.vibrate(50)
    try {
      const result = await updateDriverInfo(reservation.id, data)
      if (result.success) {
        toast.success('운전자 등록이 완료되었습니다.')
        setOpen(false)
      }
    } catch (_) {
      toast.error('운전자 등록중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="flex-1 h-12 shadow"
          onClick={e => {
            // setOpen(true)
            // 핵심: 클릭하는 순간 버튼의 포커스를 해제하여
            // aria-hidden이 걸린 영역 내에 포커스가 남지 않게 합니다.
            e.currentTarget.blur()
          }}
        >
          운전자 등록
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] w-full px-4">
        <div className="mx-auto w-full max-w-md flex flex-col h-full">
          <DrawerHeader>
            <DrawerTitle>운전자 정보 입력</DrawerTitle>
            <DrawerDescription>
              예약자와 운전자가 다를 경우 운전자 정보를 입력해주세요
            </DrawerDescription>
          </DrawerHeader>
          <div className="pb-4 space-y-3 overflow-y-auto">
            {/* onSubmit={handleSubmit(onSubmit)} */}
            <form className="space-y-5 ">
              <FormField
                label={'이름'}
                icon={<User className="w-4 h-4 text-slate-400" />}
                placeholder={'이름을 입력하세요'}
                {...register('name')}
                error={errors.name?.message}
              />
              <FormField
                label={'연락처'}
                type="tel"
                icon={<Phone className="w-4 h-4 text-slate-400" />}
                placeholder={'휴대폰 번호를 입력해주세요.'}
                {...register('phone')}
                error={errors.phone?.message}
              />
            </form>
          </div>
          <DrawerFooter className="flex w-full flex-row justify-between gap-2 px-0 mt-2">
            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12"
                disabled={isSubmitting}
              >
                취소
              </Button>
            </DrawerClose>
            <Button
              className="flex-1  h-12"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? '등록 중...' : '등록하기'}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
