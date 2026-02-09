'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AdminStackHeader({ title }: { title?: string }) {
  const router = useRouter()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-slate-100 flex items-center px-2">
      <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => router.back()}>
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="ml-2 font-bold text-slate-900 text-base truncate">
        {title ?? '상세페이지'}
      </div>
    </header>
  )
}
