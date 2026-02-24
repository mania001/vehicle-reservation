import { db } from '@/db'
import { reservations, usageSessions } from '@/db/schema'
import { ok } from '@/features/admin/_shared/api/api-response'
import { USAGE_TAB_QUERY_MAP } from '@/features/admin/usage/constants/usage-tab-query-map'
import { eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const [result] = await db
    .select({
      key_out: sql<number>`count(*) filter (where ${USAGE_TAB_QUERY_MAP.key_out.where})`,
      driving: sql<number>`count(*) filter (where ${USAGE_TAB_QUERY_MAP.driving.where})`,
      returned: sql<number>`count(*) filter (where ${USAGE_TAB_QUERY_MAP.returned.where})`,
    })
    .from(reservations)
    .leftJoin(usageSessions, eq(usageSessions.reservationId, reservations.id))

  return NextResponse.json(
    ok({
      key_out: Number(result?.key_out ?? 0),
      driving: Number(result?.driving ?? 0),
      returned: Number(result?.returned ?? 0),
    }),
  )
}
