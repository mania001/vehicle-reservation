import { and, asc, eq, isNotNull, SQL } from 'drizzle-orm'
import { UsageTabId } from './usage-tabs'
import { reservations, usageSessions } from '@/db/schema'

/**
 * usage 탭 기준 where/orderBy
 * - list API와 counts API 둘 다 이 맵을 사용해서 "기준 완전 통일"한다.
 */
export const USAGE_TAB_QUERY_MAP: Record<
  UsageTabId,
  {
    where: SQL
    orderBy: SQL[]
  }
> = {
  /**
   * 키배출 대기
   * - 예약 승인(approved)
   * - usageSession 존재
   * - status = scheduled
   */
  key_out: {
    where: and(
      eq(reservations.status, 'approved'),
      isNotNull(usageSessions.id),
      eq(usageSessions.status, 'scheduled'),
    )!,
    orderBy: [asc(reservations.startAt)],
  },

  /**
   * 운행중
   */
  driving: {
    where: and(
      eq(reservations.status, 'approved'),
      isNotNull(usageSessions.id),
      eq(usageSessions.status, 'checked_out'),
    )!,
    orderBy: [asc(reservations.endAt)],
  },

  /**
   * 반납대기
   * - 운행중인데(endAt 지남) 아직 returned 아님
   */
  // return_wait: {
  //   where: and(
  //     eq(reservations.status, 'approved'),
  //     isNotNull(usageSessions.id),
  //     eq(usageSessions.status, 'checked_out'),
  //     lt(reservations.endAt, new Date()),
  //   )!,
  //   orderBy: [
  //     // endAt이 가장 오래 지난 것부터 (지연 심한 것 우선)
  //     asc(reservations.endAt),
  //   ],
  // },

  /**
   * 반납됨 (검수 필요)
   */
  returned: {
    where: and(
      eq(reservations.status, 'approved'),
      isNotNull(usageSessions.id),
      eq(usageSessions.status, 'returned'),
    )!,
    orderBy: [
      // 반납된지 오래된 것부터 처리
      asc(usageSessions.returnedAt),
      asc(reservations.endAt),
    ],
  },

  /**
   * 완료
   * - inspected
   * - 또는 closed
   */
  // done: {
  //   where: and(
  //     isNotNull(usageSessions.id),
  //     or(eq(usageSessions.status, 'inspected'), eq(reservations.status, 'closed'))!,
  //   )!,
  //   orderBy: [desc(usageSessions.updatedAt), desc(reservations.endAt)],
  // },
}
