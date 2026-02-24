import { AdminDisplayStatus } from './admin-display-status'

type Input = {
  reservationStatus: string
  usageStatus: string | null
}

export function resolveAdminDisplayStatus({
  reservationStatus,
  usageStatus,
}: Input): AdminDisplayStatus {
  // 1️⃣ 예약 단계 종료
  if (reservationStatus === 'rejected') return 'completed'
  if (reservationStatus === 'cancelled') return 'issue'

  // 2️⃣ 승인 대기
  if (reservationStatus === 'pending') return 'pending'

  // 3️⃣ 승인됐지만 usage 없음
  if (reservationStatus === 'approved' && !usageStatus) return 'need_car'

  // 4️⃣ usage 단계
  switch (usageStatus) {
    case 'scheduled':
      return 'key_out'

    case 'checked_out':
      return 'driving'

    case 'returned':
      return 'returned'

    case 'inspected':
      return 'return_check'

    case 'no_show':
    case 'cancelled':
      return 'issue'

    case 'closed':
      return 'completed'

    default:
      return 'issue'
  }
}
