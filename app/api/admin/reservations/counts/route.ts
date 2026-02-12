import { db } from '@/db'
import { reservations, usageSessions } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const [result] = await db
    .select({
      pending: sql<number>`count(*) filter (where ${reservations.status} = 'pending')`,
      need_car: sql<number>`count(*) filter (
        where ${reservations.status} = 'approved'
        and ${usageSessions.vehicleId} is null
      )`,
      return_check: sql<number>`count(*) filter (where ${usageSessions.status} = 'returned')`,
      issue: sql<number>`count(*) filter (
        where ${reservations.status} in ('cancelled')
        or ${usageSessions.status} in ('no_show', 'cancelled')
      )`,
      // done: sql<number>`count(*) filter (where ${usageSessions.status} = 'inspected')`,
    })
    .from(reservations)
    .leftJoin(usageSessions, eq(usageSessions.reservationId, reservations.id))
  return NextResponse.json({
    pending: Number(result?.pending ?? 0),
    need_car: Number(result?.need_car ?? 0),
    return_check: Number(result?.return_check ?? 0),
    issue: Number(result?.issue ?? 0),
    // done: Number(result?.done ?? 0),
  })
}
