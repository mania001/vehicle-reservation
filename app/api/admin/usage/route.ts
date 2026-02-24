import { db } from '@/db'
import { reservations, usageSessions, vehicles } from '@/db/schema'
import { fail, ok } from '@/features/admin/_shared/api/api-response'
import { USAGE_TAB_QUERY_MAP } from '@/features/admin/usage/constants/usage-tab-query-map'
import { UsageTabId } from '@/features/admin/usage/constants/usage-tabs'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const tab = (searchParams.get('tab') ?? 'key_out') as UsageTabId

  const tabConfig = USAGE_TAB_QUERY_MAP[tab]

  if (!tabConfig) {
    return NextResponse.json(fail('NOT_FOUND', 'Invalid tab'), { status: 400 })
  }

  const list = await db
    .select({
      usageSessionId: usageSessions.id,
      reservationId: reservations.id,

      reservationPublicCode: reservations.publicCode,

      requesterName: reservations.requesterName,
      requesterPhone: reservations.requesterPhone,
      organization: reservations.organization,

      purpose: reservations.purpose,
      destination: reservations.destination,

      startAt: reservations.startAt,
      endAt: reservations.endAt,

      reservationStatus: reservations.status,
      usageStatus: usageSessions.status,

      vehicleId: usageSessions.vehicleId,
      vehicleName: vehicles.name,

      checkedOutAt: usageSessions.checkedOutAt,
      returnedAt: usageSessions.returnedAt,
      // closedAt: usageSessions.closedAt,

      createdAt: usageSessions.createdAt,
      updatedAt: usageSessions.updatedAt,
    })
    .from(usageSessions)
    .innerJoin(reservations, eq(reservations.id, usageSessions.reservationId))
    .leftJoin(vehicles, eq(vehicles.id, usageSessions.vehicleId))
    .where(tabConfig.where)
    .orderBy(...tabConfig.orderBy)
    .limit(50)

  return NextResponse.json(ok({ items: list }))
}
