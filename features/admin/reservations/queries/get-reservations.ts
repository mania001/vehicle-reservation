'use server'

import { db } from '@/db'
import { ReservationTabId } from '../constants/reservation-tabs'
import { TAB_QUERY_MAP } from '../constants/tab-query-map'
import { reservations, usageSessions, vehicles } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getReservations(tab: ReservationTabId) {
  const queryConfig = TAB_QUERY_MAP[tab]

  if (!queryConfig) {
    throw new Error('Invalid tab')
  }

  const rows = await db
    .select({
      reservationId: reservations.id,
      publicCode: reservations.publicCode,
      status: reservations.status,
      reservationStatus: reservations.status,
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

      cancelReason: reservations.cancelReason,
      noShowReportedAt: usageSessions.noShowReportedAt,

      vehicle: {
        id: vehicles.id,
        name: vehicles.name,
        plateNumber: vehicles.plateNumber,
      },
      hasIssue: usageSessions.hasIssue,
    })
    .from(reservations)
    .leftJoin(usageSessions, eq(usageSessions.reservationId, reservations.id))
    .leftJoin(vehicles, eq(vehicles.id, usageSessions.vehicleId))
    .where(queryConfig.where)
    .orderBy(...queryConfig.orderBy)

  return {
    items: rows.map(row => ({
      reservationId: row.reservationId,
      publicCode: row.publicCode,

      reservationStatus: row.reservationStatus,
      usageSessionId: row.usageSessionId,
      usageStatus: row.usageStatus,

      requesterName: row.requesterName,
      organization: row.organization,
      requesterPhone: row.requesterPhone,

      purpose: row.purpose,
      destination: row.destination,

      startAt: row.startAt.toISOString(),
      endAt: row.endAt.toISOString(),

      cancelReason: row.cancelReason ?? null,
      noShowReportedAt: row.noShowReportedAt?.toISOString() ?? null,

      vehicle: row.vehicle?.id
        ? {
            id: row.vehicle.id,
            name: row.vehicle.name,
            plateNumber: row.vehicle.plateNumber,
          }
        : null,

      hasIssue: row.hasIssue ?? null,
      createdAt: row.createdAt.toISOString(),
    })),
  }
}
