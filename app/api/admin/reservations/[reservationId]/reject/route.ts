import { db } from '@/db'
import { reservations } from '@/db/schema'
import { ReservationStatus } from '@/domains/reservation/reservation-status'
import { fail, ok } from '@/features/admin/_shared/api/api-response'
import { withAudit } from '@/features/admin/_shared/audit/with-audit'
import { AdminRole } from '@/features/admin/auth/admin-role'
import { withAdminApi } from '@/features/admin/auth/with-admin-api'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

type RejectReservationBody = {
  reason: string
}

export const POST = withAdminApi<Response, { reservationId: string }>(
  async ({ admin, req, params }) => {
    const { reservationId } = await params

    // 권한 체크 해야 함
    const { reason } = (await req.json()) as RejectReservationBody

    const reservation = await db.query.reservations.findFirst({
      where: eq(reservations.id, reservationId),
    })

    if (!reservation) {
      return NextResponse.json(fail('NOT_FOUND', '예약을 찾을 수 없습니다.'), { status: 404 })
    }

    if (!reason || reason.trim().length < 2) {
      return NextResponse.json(fail('VALIDATION_ERROR', '반려 사유를 입력해주세요.'), {
        status: 400,
      })
    }

    if (reservation.status !== 'pending') {
      return NextResponse.json(fail('CONFLICT', 'pending 상태의 예약만 반려할 수 있습니다.'), {
        status: 409,
      })
    }

    const now = new Date()

    await withAudit(
      req,
      {
        reservationId: reservation.id,
        action: 'reservation.reject',
        entityType: 'reservation',
        entityId: reservation.id,
        actorType: 'admin',
        actorId: admin.id,
        message: `예약 반려: ${reason}`,
        prevData: {
          status: reservation.status,
        },
        nextData: {
          status: ReservationStatus.REJECTED,
          rejectedReason: reason,
        },
      },
      async () => {
        await db
          .update(reservations)
          .set({
            status: ReservationStatus.REJECTED,
            rejectedAt: now,
            rejectedReason: reason,
            updatedAt: now,
          })
          .where(eq(reservations.id, reservationId))
      },
    )

    return NextResponse.json(ok({ reservationId }))
  },
  { role: AdminRole.RESERVATION_MANAGER },
)
