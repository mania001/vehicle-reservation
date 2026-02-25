import { AdminAction } from '../model/admin-state-machine'

export type AdminActionUI = {
  action: AdminAction
  label: string
  className: string
}

export const ADMIN_ACTION_UI_MAP: Record<AdminAction, AdminActionUI> = {
  approve: {
    action: 'approve',
    label: '승인 / 배차',
    className: ' bg-primary text-white',
  },
  reject: {
    action: 'reject',
    label: '거절',
    className: 'bg-gray-100 text-gray-500',
  },
  check_out: {
    action: 'check_out',
    label: '키 배출',
    className: 'bg-emerald-600 text-white',
  },
  mark_returned: {
    action: 'mark_returned',
    label: '반납 처리',
    className: 'bg-orange-500 text-white',
  },
  inspect: {
    action: 'inspect',
    label: '점검 완료',
    className: 'bg-purple-600 text-white',
  },
  assign_vehicle: {
    action: 'assign_vehicle',
    label: '배차',
    className: 'bg-indigo-600 text-white',
  },
}
