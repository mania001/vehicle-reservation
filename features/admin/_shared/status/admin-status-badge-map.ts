import { AdminDisplayStatus } from './admin-display-status'

export const ADMIN_STATUS_BADGE_MAP: Record<
  AdminDisplayStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
> = {
  pending: { label: '승인대기', variant: 'outline' },
  need_car: { label: '배차필요', variant: 'secondary' },
  key_out: { label: '키배출', variant: 'secondary' },
  driving: { label: '운행중', variant: 'default' },
  returned: { label: '반납확인', variant: 'secondary' },
  return_check: { label: '반납확인', variant: 'secondary' },
  completed: { label: '완료', variant: 'outline' },
  issue: { label: '이슈', variant: 'destructive' },
}
