export const RESERVATION_TABS = [
  { id: 'pending', label: '승인대기' },
  { id: 'need_car', label: '배차필요' },
  { id: 'return_check', label: '반납확인' },
  { id: 'issue', label: '취소/이슈' },
  { id: 'done', label: '완료' },
] as const

export type ReservationTabId = (typeof RESERVATION_TABS)[number]['id']
