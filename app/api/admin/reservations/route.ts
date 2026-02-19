import { db } from '@/db'
import { reservations, usageSessions, vehicles } from '@/db/schema'
import { ok } from '@/features/admin/_shared/api/api-response'
import { ReservationTabId } from '@/features/admin/reservations/constants/reservation-tabs'
import { TAB_QUERY_MAP } from '@/features/admin/reservations/constants/tab-query-map'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tab = (searchParams.get('tab') ?? 'pending') as ReservationTabId

  const queryConfig = TAB_QUERY_MAP[tab]

  if (!queryConfig) {
    return NextResponse.json({ error: 'Invalid tab' }, { status: 400 })
  }

  const rows = await db
    .select({
      reservationId: reservations.id,
      publicCode: reservations.publicCode,
      status: reservations.status,
      requesterName: reservations.requesterName,
      requesterPhone: reservations.requesterPhone,
      organization: reservations.organization,
      purpose: reservations.purpose,
      destination: reservations.destination,
      startAt: reservations.startAt,
      endAt: reservations.endAt,
      createdAt: reservations.createdAt,

      usageSessionId: usageSessions.id,
      usageStatus: usageSessions.status,
      approvedAt: usageSessions.approvedAt,
      checkedOutAt: usageSessions.checkedOutAt,
      returnedAt: usageSessions.returnedAt,
      inspectedAt: usageSessions.inspectedAt,

      vehicleId: vehicles.id,
      vehicleName: vehicles.name,
      vehicleNumber: vehicles.plateNumber,
    })
    .from(reservations)
    .leftJoin(usageSessions, eq(usageSessions.reservationId, reservations.id))
    .leftJoin(vehicles, eq(vehicles.id, usageSessions.vehicleId))
    .where(queryConfig.where)
    .orderBy(...queryConfig.orderBy)

  return NextResponse.json(
    ok({
      items: rows,
    }),
  )
}
