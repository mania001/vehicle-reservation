import { and, asc, desc, eq, isNull, ne, or, SQL } from 'drizzle-orm'
import { ReservationTabId } from './reservation-tabs'
import { reservations, usageSessions } from '@/db/schema'

export const TAB_QUERY_MAP: Record<
  ReservationTabId,
  {
    where: SQL
    orderBy: SQL[]
  }
> = {
  pending: {
    where: eq(reservations.status, 'pending'),
    orderBy: [asc(reservations.createdAt)],
  },

  need_car: {
    where: and(eq(reservations.status, 'approved'), isNull(usageSessions.vehicleId))!,
    orderBy: [asc(reservations.startAt)],
  },

  return_check: {
    where: and(eq(usageSessions.status, 'inspected'), ne(reservations.status, 'closed'))!,
    orderBy: [
      // 반납된지 오래된 것부터(빨리 처리해야 하니까)
      asc(usageSessions.inspectedAt),
      asc(reservations.endAt),
    ],
  },

  issue: {
    where: and(
      ne(reservations.status, 'closed'),
      or(
        eq(reservations.status, 'cancelled'),
        eq(usageSessions.status, 'no_show'),
        eq(usageSessions.status, 'cancelled'),
      ),
    )!,
    orderBy: [desc(reservations.updatedAt), desc(reservations.createdAt)],
  },

  done: {
    where: or(eq(reservations.status, 'rejected'), eq(reservations.status, 'closed'))!,
    orderBy: [desc(usageSessions.inspectedAt), desc(reservations.endAt)],
  },
}
