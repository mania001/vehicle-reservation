import { db } from '@/db'
import {
  usageSessionCheckItems,
  usageSessionChecks,
  usageSessionPhotos,
  usageSessions,
  vehicles,
} from '@/db/schema'
import { UsageStatus } from '@/domains/usage-session/usage-status'
import { fail, ok } from '@/features/admin/_shared/api/api-response'
import { withAudit } from '@/features/admin/_shared/audit/with-audit'
import { AdminRole } from '@/features/admin/auth/admin-role'
import { withAdminApi } from '@/features/admin/auth/with-admin-api'
import { selectionToRows } from '@/lib/selection'
import { uploadMultipleFiles } from '@/lib/supabase/storage'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const POST = withAdminApi<Response, { usageSessionId: string }>(
  async ({ admin, req, params }) => {
    const { usageSessionId } = await params

    const usageSession = await db.query.usageSessions.findFirst({
      where: eq(usageSessions.id, usageSessionId),
    })

    if (!usageSession) {
      return NextResponse.json(fail('NOT_FOUND', '사용 세션을 찾을 수 없습니다.'), { status: 404 })
    }

    const formData = await req.formData()

    const mileage = Number(formData.get('mileage'))
    const fuelLevel = Number(formData.get('fuelLevel'))
    const parkingZone = formData.get('parkingZone') as string
    const parkingNumber = formData.get('parkingNumber') as string
    const isCleaned = formData.get('isCleaned') === 'true'
    const note = formData.get('note') as string | null
    const photos = formData.getAll('images') as File[]
    const issue = formData.get('issue') === 'true'
    const selectionsRaw = formData.get('selections') as string
    const selections = JSON.parse(selectionsRaw)

    const now = new Date()

    // 유틸리티 호출: 일괄 업로드 및 URL 획득
    const uploadResults = await uploadMultipleFiles(
      photos,
      'vehicle',
      `usage/${usageSessionId}/admin`,
    )

    // DB에는 path 배열이나 publicUrl 배열 중 선택해서 저장
    const photoUrls = uploadResults.map(res => res.path)

    await withAudit(
      req,
      {
        reservationId: usageSession.reservationId,
        action: 'usage.inspect',
        entityType: 'usage_session',
        entityId: usageSessionId,
        actorType: 'admin',
        actorId: admin.id,
        message: '관리자 점검 완료',
        prevData: {
          status: usageSession.status,
        },
        nextData: {
          status: UsageStatus.INSPECTED,
          hasIssue: issue,
        },
      },

      async () => {
        await db.transaction(async tx => {
          /**
           * check 생성
           */
          const [check] = await tx
            .insert(usageSessionChecks)
            .values({
              usageSessionId,
              type: 'admin_inspect',
              mileage,
              fuelLevel,
              parkingZone,
              parkingNumber,
              isCleaned,
              note,
            })
            .returning()

          if (photoUrls.length > 0) {
            await tx.insert(usageSessionPhotos).values(
              photoUrls.map(path => ({
                checkId: check.id,
                usageSessionId,
                type: 'admin_inspect',
                url: path,
              })),
            )
          }

          /**
           * selection 저장
           */

          const rows = selectionToRows(check.id, selections)

          if (rows.length) {
            await tx.insert(usageSessionCheckItems).values(rows)
          }

          // 차량 정보 업데이트 (마지막 주행 기록 반영)
          await tx
            .update(vehicles)
            .set({
              mileage,
              fuelLevel,
              lastParkingZone: parkingZone,
              lastParkingNumber: parkingNumber,
              updatedAt: now,
            })
            .where(eq(vehicles.id, usageSession.vehicleId!))

          /**
           * 상태 변경
           */
          await tx
            .update(usageSessions)
            .set({
              status: UsageStatus.INSPECTED,
              updatedAt: now,
              hasIssue: issue,
              issueReportedAt: issue ? now : null,
              inspectedAt: now,
            })
            .where(eq(usageSessions.id, usageSessionId))
        })
      },
    )

    return NextResponse.json(
      ok({
        usageSessionId,
      }),
    )
  },
  { role: AdminRole.VEHICLE_MANAGER },
)
