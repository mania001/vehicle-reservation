import { db } from '@/db'
import { reservations, usageSessions, vehicles } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getReservationByPublicCode(publicCode: string) {
  // const reservation = await db.query.reservations.findFirst({
  //   where: eq(reservations.publicCode, publicCode),
  // })

  const reservation = await db
    .select({
      id: reservations.id,
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
      beforeDriveChecked: usageSessions.beforeDriveChecked,
      // approvedAt: usageSessions.approvedAt,
      // checkedOutAt: usageSessions.checkedOutAt,
      // returnedAt: usageSessions.returnedAt,
      // inspectedAt: usageSessions.inspectedAt,

      // cancelReason: reservations.cancelReason,
      // noShowReportedAt: usageSessions.noShowReportedAt,

      vehicle: {
        id: vehicles.id,
        name: vehicles.name,
        plateNumber: vehicles.plateNumber,
      },
    })
    .from(reservations)
    .leftJoin(usageSessions, eq(usageSessions.reservationId, reservations.id))
    .leftJoin(vehicles, eq(vehicles.id, usageSessions.vehicleId))
    .where(eq(reservations.publicCode, publicCode))
    .limit(1)

  if (!reservation) {
    return null
  }

  return reservation[0]
}
