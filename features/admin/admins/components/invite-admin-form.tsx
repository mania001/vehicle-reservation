'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useInviteAdminForm } from '../hooks/use-invite-admin-form'
import { InviteAdminFormValues } from '../schema/invite-admin-schema'
import { inviteAdmin } from '../action/invite-admin'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Controller } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function InviteAdminForm() {
  const form = useInviteAdminForm()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const onSubmit = async (data: InviteAdminFormValues) => {
    if (navigator.vibrate) navigator.vibrate(50)
    try {
      const result = await inviteAdmin(data)
      if (result.success) {
        toast.success('초대 메일 발송 했습니다.')
      } else {
        toast.error(result.message)
      }
    } catch (_) {
      toast.error('관리자 초대 중 문제가 발생 했습니다.')
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          {...register('email')}
          className="h-12"
          type="email"
          required
          placeholder="admin@example.com"
        />
        {errors.email && <p className="text-xs text-red-500 mt-1.5">* {errors.email.message} </p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">이름</Label>
        <Input
          {...register('name')}
          className="h-12"
          type="text"
          required
          placeholder="이름을 입력하세요"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1.5">* {errors.name.message} </p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">역활</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="역할을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reservation_manager">예약 관리자</SelectItem>
                <SelectItem value="vehicle_manager">차량 관리자</SelectItem>
                <SelectItem value="super_admin">슈퍼 관리자</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1.5">* {errors.name.message} </p>}
      </div>

      <Button type="submit" className="w-full h-14 text-md" disabled={isSubmitting}>
        {isSubmitting ? '초대하는 중...' : '초대하기'}
      </Button>
    </form>
  )
}
