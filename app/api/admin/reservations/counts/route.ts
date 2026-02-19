import { db } from '@/db'
import { reservations, usageSessions } from '@/db/schema'
import { ok } from '@/features/admin/_shared/api/api-response'
import { TAB_QUERY_MAP } from '@/features/admin/reservations/constants/tab-query-map'
import { eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const [result] = await db
    .select({
      pending: sql<number>`count(*) filter (where ${TAB_QUERY_MAP.pending.where})`,
      need_car: sql<number>`count(*) filter (where ${TAB_QUERY_MAP.need_car.where})`,
      return_check: sql<number>`count(*) filter (where ${TAB_QUERY_MAP.return_check.where})`,
      issue: sql<number>`count(*) filter (where ${TAB_QUERY_MAP.issue.where})`,
      // done: sql<number>`count(*) filter (where ${TAB_QUERY_MAP.done.where})`,
    })
    .from(reservations)
    .leftJoin(usageSessions, eq(usageSessions.reservationId, reservations.id))

  return NextResponse.json(
    ok({
      pending: Number(result?.pending ?? 0),
      need_car: Number(result?.need_car ?? 0),
      return_check: Number(result?.return_check ?? 0),
      issue: Number(result?.issue ?? 0),
      // done: Number(result?.done ?? 0),
    }),
  )
}
