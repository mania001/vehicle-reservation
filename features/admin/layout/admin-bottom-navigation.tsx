'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ADMIN_NAV_ITEMS } from '../config/admin-nav'

export function AdminBottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 max-w-md border-t mx-auto border-gray-100 w-full z-50 bg-background pt-1 pb-4 shadow-md rounded-t-2xl backdrop-blur-xl ">
      <ul className="flex h-14">
        {ADMIN_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  'flex h-full flex-col items-center justify-center gap-1 text-xs transition-colors',
                  active ? 'text-primary font-extrabold' : 'text-muted-foreground',
                )}
              >
                <Icon
                  className={cn(
                    'h-5.5 w-5.5',
                    active
                      ? 'stroke-[2.5] text-primary text-shadow-sm'
                      : 'stroke-[1.5] text-muted-foreground',
                  )}
                  // fill={cn(active ? '#485b48' : 'none')}
                />
                <span className={cn(active && 'text-shadow-sm')}>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
