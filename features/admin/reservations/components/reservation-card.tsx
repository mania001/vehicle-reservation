'use client'

import { cn } from '@/lib/utils'
import { Calendar, PhoneCall, User } from 'lucide-react'
import { AdminReservationListItem } from '../types/reservaiton-list-item'
import { getReservationPeriod, getTimeAgo } from '@/lib/time'
import { useRouter } from 'next/navigation'

type Props = {
  item: AdminReservationListItem
}

export default function ReservationCard({ item }: Props) {
  const router = useRouter()
  const timeAgo = getTimeAgo(item.createdAt)
  const { range, duration } = getReservationPeriod(item.startAt, item.endAt)

  const handleCardClick = () => {
    router.push(`/admin/reservations/${item.id}`)
  }

  return (
    <div
      className={cn(
        'bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4 transition-all',
        // item.isLate && 'border-rose-200 bg-rose-50',
      )}
      onClick={handleCardClick}
    >
      <div className="relative pointer-events-none flex justify-between items-start">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full">
            승인 대기
          </span>
          <span className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-black rounded-full italic">
            # - {item.publicCode}
          </span>
        </div>
        <p className="text-[10px] font-bold text-gray-300">{timeAgo}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
          <User className="text-gray-400" size={24} />
        </div>
        <div>
          <h3 className="flex items-center gap-2">
            <span className="text-lg font-bold">{item.requesterName}</span>
            <span className="text-xs text-muted-foreground">{item.organization}</span>
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <PhoneCall size={12} strokeWidth={3} /> {item.requesterPhone}
          </p>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-500 text-center">
        <p>
          <Calendar className="inline mr-1" size={12} strokeWidth={3} /> {range} ({duration})
        </p>
      </div>

      <div className="bg-slate-50/80 rounded-2xl p-4 space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">방문 목적 (목적지)</p>
        <p className="text-sm font-bold text-slate-600 leading-relaxed">
          {item.purpose} ({item.destination})
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 pointer-events-auto">
        <button
          onClick={e => {
            e.stopPropagation()
            alert('승인/배차')
          }}
          className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 transition-transform active:scale-95"
        >
          승인 / 배차
        </button>
        <button
          onClick={e => {
            e.stopPropagation()
            alert('반려')
          }}
          className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm transition-transform active:scale-95"
        >
          반려
        </button>
      </div>
    </div>
  )
}

// {/* 이슈 카드 예시 */}
//     <div className="p-5 bg-red-50 border border-red-100 rounded-[2rem] space-y-3">
//       <div className="flex items-center gap-2 text-red-600">
//         <AlertCircle size={16} />
//         <p className="text-xs font-black">사용자 취소 발생</p>
//       </div>
//       <h3 className="font-bold text-gray-900">
//         이영희 <span className="font-normal text-gray-500 text-sm">기획팀</span>
//       </h3>
//       <p className="text-xs text-red-700/70 font-medium">사유: 미팅 일정이 취소되었습니다.</p>
//     </div>
