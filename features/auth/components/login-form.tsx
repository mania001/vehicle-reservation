'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoginForm } from '../hooks/use-login-form'
import { LoginFormValues } from '../schema/login-schema'
import { toast } from 'sonner'
import { AuthErrorMessage } from './auth-error-message'
import { adminLogin } from '../actions/admin-login'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const form = useLoginForm()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  // 3. 서버 액션 제출 핸들러
  const onSubmit = async (data: LoginFormValues) => {
    if (navigator.vibrate) navigator.vibrate(50)
    try {
      const result = await adminLogin(data)
      if (result.success) {
        toast.success('로그인이 완료되었습니다.')
        router.push(`/admin`)
      } else {
        toast.error(result.message)
      }
    } catch (e) {
      console.error('Login error:', e)
      toast.error('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', {
        description: (e as Error).message,
      })
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Log In</CardTitle>
        <CardDescription>환영합니다. 관리자 계정으로 로그인하세요.</CardDescription>
      </CardHeader>
      <CardContent>
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
            {errors.email && <AuthErrorMessage message={errors.email.message} />}
          </div>

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

          {/* {state?.success === false && <AuthErrorMessage code={state.code!} />} */}

          <Button type="submit" className="w-full h-14 text-md" disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
