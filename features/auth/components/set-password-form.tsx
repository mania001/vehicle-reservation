'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSetPasswordForm } from '../hooks/use-set-password-form'
import { AuthErrorMessage } from './auth-error-message'
import { SetPasswordFormValues } from '../schema/set-password-schema'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SetPasswordForm() {
  const supabase = createClient()
  const router = useRouter()
  const form = useSetPasswordForm()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  // 3. 서버 액션 제출 핸들러
  const onSubmit = async (data: SetPasswordFormValues) => {
    if (navigator.vibrate) navigator.vibrate(50)
    try {
      const { password } = data
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('비밀번호 설정을 완료 했습니다.')
      router.push('/admin/pending')
    } catch (_) {
      toast.error('비밀번호 설정 중 문제가 발생 했습니다.')
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">관리자 비밀번호 설정</CardTitle>
        <CardDescription>관리자 로그인에 사용 할 비밀번호를 입력해주세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              {...register('password')}
              className="h-12"
              type="password"
              required
              placeholder="비밀번호를 입력해주세요."
            />
            {errors.password && <AuthErrorMessage message={errors.password.message} />}
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
            <Input
              {...register('passwordConfirm')}
              className="h-12"
              type="password"
              required
              placeholder="비밀번호 확인을 입력해주세요."
            />
            {errors.passwordConfirm && (
              <AuthErrorMessage message={errors.passwordConfirm.message} />
            )}
          </div>

          {/* {state?.success === false && <AuthErrorMessage code={state.code!} />} */}

          <Button type="submit" className="w-full h-14 text-md" disabled={isSubmitting}>
            {isSubmitting ? '비밀번호 설정 중...' : '비밀번호 설정'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
