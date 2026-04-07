import { db } from '@/db'
import { usageSessions } from '@/db/schema'
import { UsageStatus } from '@/domains/usage-session/usage-status'
import { fail, ok } from '@/features/admin/_shared/api/api-response'
import { withAudit } from '@/features/admin/_shared/audit/with-audit'
import { AdminRole } from '@/features/admin/auth/admin-role'
import { withAdminApi } from '@/features/admin/auth/with-admin-api'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const POST = withAdminApi<Response, { usageSessionId: string }>(
  async ({ admin, req, params }) => {
    const { usageSessionId } = await params

    const usage = await db.query.usageSessions.findFirst({
      where: eq(usageSessions.id, usageSessionId),
    })

    if (!usage) {
      return NextResponse.json(fail('NOT_FOUND', '사용 세션을 찾을 수 없습니다.'), { status: 404 })
    }

    if (usage.status !== UsageStatus.SCHEDULED) {
      return NextResponse.json(fail('VALIDATION_ERROR', 'Invalid state transition'), {
        status: 400,
      })
    }

    const now = new Date()

    // actorType: 'system', actorId: null,  ->  actorType: 'admin', actorId: auth.admin.id, 로 변경 필요
    await withAudit(
      req,
      {
        reservationId: usage.reservationId,
        action: 'usage.checkout',
        entityType: 'usage_session',
        entityId: usageSessionId,
        actorType: 'admin',
        actorId: admin.id,
        message: '키가 정상적으로 배출 되었습니다.',
        prevData: {
          status: usage.status,
        },
        nextData: {
          status: UsageStatus.CHECKED_OUT,
        },
      },
      async () => {
        await db
          .update(usageSessions)
          .set({
            status: UsageStatus.CHECKED_OUT,
            checkedOutAt: now,
            updatedAt: now,
          })
          .where(eq(usageSessions.id, usageSessionId))
      },
    )

    return NextResponse.json(ok({ usageSessionId }))
  },
  { role: AdminRole.VEHICLE_MANAGER },
)
