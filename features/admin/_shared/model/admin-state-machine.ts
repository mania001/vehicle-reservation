import { ReservationStatus } from '@/domains/reservation/reservation-status'
import { UsageStatus } from '@/domains/usage-session/usage-status'

export type AdminDomainState = {
  reservationStatus: ReservationStatus
  usageStatus: UsageStatus | null
}

// ----------------------------------
// 1️⃣ UI 파생 상태
// ----------------------------------
export type AdminDisplayStatus =
  | 'pending' // 승인대기
  | 'need_car' // 승인됐지만 usage 없음
  | 'key_out' // usage scheduled
  | 'driving' // checked_out
  | 'returned' // returned
  | 'return_check' // inspected
  | 'completed' // reservation closed, rejected
  | 'issue' //  cancelled, no_show

// ----------------------------------
// 1️⃣ UI 파생 상태
// ----------------------------------
export type AdminAction =
  | 'approve'
  | 'reject'
  | 'assign_vehicle'
  | 'check_out'
  | 'mark_returned'
  | 'inspect'

// ----------------------------------
// 3️⃣ displayStatus 파생 로직
// ----------------------------------
export function deriveDisplayStatus(state: AdminDomainState): AdminDisplayStatus {
  const { reservationStatus, usageStatus } = state

  if (reservationStatus === 'pending') return 'pending'

  if (reservationStatus === 'rejected') return 'completed'
  if (reservationStatus === 'cancelled') return 'issue'

  if (reservationStatus === 'approved' && !usageStatus) return 'need_car'

  if (usageStatus === 'scheduled') return 'key_out'
  if (usageStatus === 'checked_out') return 'driving'
  if (usageStatus === 'returned') return 'returned'
  if (usageStatus === 'inspected') return 'return_check'

  return 'issue'
}

// ----------------------------------
// 4️⃣ Badge 정의 (displayStatus 기준)
// ----------------------------------
export const ADMIN_BADGE_MAP: Record<AdminDisplayStatus, { label: string; className: string }> = {
  pending: { label: '예약 대기', className: 'bg-blue-50 text-blue-600' },
  need_car: { label: '차량 배정 필요', className: 'bg-purple-50 text-purple-600' },
  key_out: { label: '출고 대기', className: 'bg-indigo-50 text-indigo-600' },
  driving: { label: '운행 중', className: 'bg-green-50 text-green-600' },
  returned: { label: '반납 점검', className: 'bg-yellow-50 text-yellow-600' },
  return_check: { label: '최종 반납 확인', className: 'bg-yellow-50 text-yellow-600' },
  completed: { label: '완료', className: 'bg-gray-100 text-gray-500' },
  issue: { label: '이슈', className: 'bg-rose-50 text-rose-600' },
}

// ----------------------------------
// 5️⃣ 상태 전이 정의 (진짜 상태머신)
// ----------------------------------
type Transition = {
  next: AdminDisplayStatus
  requiresDrawer?: boolean
}

export const ADMIN_STATE_MACHINE: Record<
  AdminDisplayStatus,
  Partial<Record<AdminAction, Transition>>
> = {
  pending: {
    approve: { next: 'need_car', requiresDrawer: true },
    reject: { next: 'issue', requiresDrawer: true },
  },

  need_car: {
    assign_vehicle: { next: 'key_out', requiresDrawer: true },
  },

  key_out: {
    check_out: { next: 'driving' },
  },

  driving: {
    mark_returned: { next: 'return_check' },
  },

  returned: {},

  return_check: {
    inspect: { next: 'completed', requiresDrawer: true },
  },

  completed: {},
  issue: {},
}

// ----------------------------------
// 6️⃣ 헬퍼 함수 (UI에서 사용하는 API)
// ----------------------------------
export function getBadge(domainState: AdminDomainState) {
  const displayStatus = deriveDisplayStatus(domainState)
  return ADMIN_BADGE_MAP[displayStatus]
}

export function getAvailableActions(domainState: AdminDomainState): AdminAction[] {
  const displayStatus = deriveDisplayStatus(domainState)

  return Object.keys(ADMIN_STATE_MACHINE[displayStatus] ?? {}) as AdminAction[]
}

export function getTransition(
  domainState: AdminDomainState,
  action: AdminAction,
): Transition | null {
  const displayStatus = deriveDisplayStatus(domainState)

  return ADMIN_STATE_MACHINE[displayStatus]?.[action] ?? null
}
