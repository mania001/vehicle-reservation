import { TimelineStatus } from './timeline.types'

export const TIMELINE_STEPS: {
  key: TimelineStatus
  label: string
}[] = [
  { key: 'pending', label: '예약 접수' },
  { key: 'approved', label: '예약 승인' },
  { key: 'in_use', label: '차량 사용' },
  { key: 'completed', label: '반납 완료' },
]
