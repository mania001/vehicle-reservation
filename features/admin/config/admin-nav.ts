import { CalendarCheck, CarFront, Ellipsis, MapPinCheck } from 'lucide-react'

export const ADMIN_NAV_ITEMS = [
  {
    href: '/admin/reservations',
    label: '예약',
    headerTitle: '차량예약',
    icon: CalendarCheck,
  },
  {
    href: '/admin/usage',
    label: '운행',
    headerTitle: '차량운행',
    icon: MapPinCheck,
  },
  {
    href: '/admin/vehicles',
    label: '차량',
    headerTitle: '차량관리',
    icon: CarFront,
  },
  {
    href: '/admin/setting',
    label: '더보기',
    headerTitle: '더보기',
    icon: Ellipsis,
  },
] as const
