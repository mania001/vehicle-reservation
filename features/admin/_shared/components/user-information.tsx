import { PhoneCall, User } from 'lucide-react'
import { AdminBookingItem } from '../types/admin-booking-item'
import { formatPhoneNumber } from '@/lib/utils'

type Props = {
  item: AdminBookingItem
}

export function UserInformation({ item }: Props) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
        <User size={24} className="text-gray-400" />
      </div>
      <div>
        <h3 className="font-bold">
          {item.requesterName}{' '}
          <span className="text-xs text-muted-foreground">{item.organization}</span>
        </h3>

        <a
          href={`tel:${item.requesterPhone}`}
          onClick={e => e.stopPropagation()}
          className="text-sm text-muted-foreground flex items-center gap-2"
        >
          <PhoneCall size={12} /> {formatPhoneNumber(item.requesterPhone)}
        </a>
      </div>
    </div>
  )
}
