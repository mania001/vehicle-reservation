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
    className: 'bg-primary text-white',
  },
  no_show: {
    action: 'no_show',
    label: '노쇼 처리',
    className: 'bg-gray-100 text-gray-500',
  },
  mark_returned: {
    action: 'mark_returned',
    label: '반납 처리',
    className: 'bg-orange-500 text-white',
  },
  inspect: {
    action: 'inspect',
    label: '점검 완료',
    className: 'bg-primary text-white',
  },
  assign_vehicle: {
    action: 'assign_vehicle',
    label: '배차',
    className: 'bg-primary text-white',
  },
  no_show_check: {
    action: 'no_show_check',
    label: '노쇼 확정',
    className: 'bg-primary text-white',
  },
  canceled_check: {
    action: 'canceled_check',
    label: '사용자 취소 확인',
    className: 'bg-primary text-white',
  },
  issue_check: {
    action: 'canceled_check',
    label: '이슈 처리 완료',
    className: 'bg-primary text-white',
  },
}
