'use client'

import { Button } from '@/components/ui/button'
import { Logout } from '@/features/auth/actions/logout'
import { useTransition } from 'react'

export default function LogoutPage() {
  const [, startTransition] = useTransition()

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-xl font-semibold">로그아웃</h1>

        <Button
          onClick={() =>
            startTransition(() => {
              Logout()
            })
          }
        >
          로그아웃
        </Button>
      </div>
    </div>
  )
}
