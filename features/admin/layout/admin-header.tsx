'use client'

import { Bell, Search } from 'lucide-react'
import { ADMIN_NAV_ITEMS } from '../config/admin-nav'
import { usePathname } from 'next/navigation'

export function AdminHeader() {
  const pathname = usePathname()
  const matched = ADMIN_NAV_ITEMS.find(item => pathname.startsWith(item.href))

  const baseTitle = matched?.headerTitle ?? '관리자'

  return (
    <header className="fixed w-full max-w-md top-0 z-50 h-14 bg-white flex justify-between items-center px-4">
      <h1 className="font-bold text-slate-900 text-base">{baseTitle}</h1>
      <div className="flex gap-4">
        <button>
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>
        <button>
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  )
}
