import { AdminAction } from '../actions/admin-actions'
import { AdminDisplayStatus } from './admin-display-status'

export const ADMIN_BADGE_MAP: Record<AdminDisplayStatus, { label: string; className: string }> = {
  pending: { label: '승인대기', className: 'bg-blue-50 text-blue-600' },
  need_car: { label: '배차필요', className: 'bg-purple-50 text-purple-600' },
  key_out: { label: '키배출', className: 'bg-indigo-50 text-indigo-600' },
  driving: { label: '운행중', className: 'bg-green-50 text-green-600' },
  returned: { label: '반납확인', className: 'bg-yellow-50 text-yellow-600' },
  return_check: { label: '반납체크', className: 'bg-yellow-50 text-yellow-600' },
  completed: { label: '완료', className: 'bg-gray-100 text-gray-500' },
  issue: { label: '이슈', className: 'bg-rose-50 text-rose-600' },
}

// export type AdminAction =
//   | 'approve'
//   | 'reject'
//   | 'assign_vehicle'
//   | 'check_out'
//   | 'mark_returned'
//   | 'inspect'

export const ADMIN_ACTION_MAP: Record<AdminDisplayStatus, AdminAction[]> = {
  pending: ['approve', 'reject'],
  need_car: ['assign_vehicle'],
  key_out: ['check_out'],
  driving: ['mark_returned'],
  returned: [],
  return_check: ['inspect'],
  completed: [],
  issue: [],
}
