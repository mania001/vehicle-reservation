'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { reinviteAdmin } from '@/features/admin/admins/action/reinvite-admin'
import { toast } from 'sonner'
import { Loader2, MailWarning } from 'lucide-react'
import { Button } from '@/components/ui/button'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [errorStatus, setErrorStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const email = searchParams.get('email')

  useEffect(() => {
    const handleAuth = async () => {
      const hash = window.location.hash

      // 1. 만료 에러 체크
      if (hash.includes('error_code=otp_expired')) {
        setErrorStatus('expired')
        return
      }

      // 2. 정상 토큰 처리 (강제 세션 주입 방식)
      const params = new URLSearchParams(hash.substring(1))

      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken && refreshToken) {
        // 3. 토큰이 있다면 강제로 세션을 설정합니다.
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (!error) {
          router.replace('/admin/set-password')
          return
        }
      }

      // 3. 만약 해시가 아니라 ?code= 형태로 왔을 경우를 대비한 보험
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.replace('/admin/set-password')
      } else {
        // 둘 다 없다면 잠시 대기 후 세션 체크 (느린 네트워크 대비)
        setTimeout(async () => {
          const { data } = await supabase.auth.getSession()
          if (data.session) router.replace('/admin/set-password')
        }, 2000)
      }
    }

    handleAuth()
  }, [router, supabase])

  // 재발송 클릭 함수
  const handleResend = async () => {
    if (!email) return
    setLoading(true)
    const result = await reinviteAdmin(email)
    setLoading(false)

    if (result.success) {
      toast.success('초대 메일을 다시 보냈습니다. 메일함을 확인해주세요!')
    } else {
      toast.error(result.message)
    }
  }

  // 만료 시 보여줄 화면
  if (errorStatus === 'expired' && email) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-2xl bg-white shadow-xl max-w-sm w-full">
        <div className="bg-amber-100 p-4 rounded-full mb-4">
          <MailWarning className="w-10 h-10 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-900">링크 만료</h2>
        <p className="text-center text-slate-500 mb-8">
          <span className="font-semibold text-slate-800">{email}</span> 님,
          <br />
          초대 링크가 만료되었습니다.
        </p>
        <Button onClick={handleResend} disabled={loading} className="w-full h-12 text-lg">
          {loading ? <Loader2 className="animate-spin mr-2" /> : null}내 메일로 다시 받기
        </Button>
      </div>
    )
  }

  return <div className="animate-pulse font-medium">인증 정보를 확인하고 있습니다...</div>
}

export default function AuthCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Suspense fallback={<div>로딩 중...</div>}>
        <CallbackContent />
      </Suspense>
    </main>
  )
}
