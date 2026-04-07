import { db } from '@/db'
import { reservations } from '@/db/schema'
import { ReservationStatus } from '@/domains/reservation/reservation-status'
import { fail, ok } from '@/features/admin/_shared/api/api-response'
import { withAudit } from '@/features/admin/_shared/audit/with-audit'
import { AdminRole } from '@/features/admin/auth/admin-role'
import { withAdminApi } from '@/features/admin/auth/with-admin-api'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const POST = withAdminApi<Response, { reservationId: string }>(
  async ({ admin, req, params }) => {
    const { reservationId } = await params

    const reservation = await db.query.reservations.findFirst({
      where: eq(reservations.id, reservationId),
    })

    if (!reservation) {
      return NextResponse.json(fail('NOT_FOUND', '예약을 찾을 수 없습니다.'), { status: 404 })
    }

    if (reservation.status === ReservationStatus.CLOSED) {
      return NextResponse.json(fail('VALIDATION_ERROR', '이미 종료된 예약입니다.'), { status: 400 })
    }

    const now = new Date()

    await withAudit(
      req,
      {
        reservationId,
        action: 'reservation.close',
        entityType: 'reservation',
        entityId: reservationId,

        actorType: 'admin',
        actorId: admin.id,

        message: '예약 종료',

        prevData: {
          status: reservation.status,
        },

        nextData: {
          status: ReservationStatus.CLOSED,
        },
      },
      async () => {
        await db
          .update(reservations)
          .set({
            status: ReservationStatus.CLOSED,
            updatedAt: now,
          })
          .where(eq(reservations.id, reservationId))
      },
    )

    return NextResponse.json(ok({ reservationId }))
  },
  { role: AdminRole.RESERVATION_MANAGER },
)
