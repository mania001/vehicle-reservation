import { db } from '@/db'
import {
  usageSessionCheckItems,
  usageSessionChecks,
  usageSessionPhotos,
  usageSessions,
} from '@/db/schema'
import { fail, ok } from '@/features/admin/_shared/api/api-response'
import { getStorageUrl } from '@/lib/supabase/storage'
import { and, desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { usageSessionId: string } }) {
  try {
    const { usageSessionId } = await params

    /**
     * 현재 usage session
     */
    const usage = await db.query.usageSessions.findFirst({
      where: eq(usageSessions.id, usageSessionId),
    })

    if (!usage) {
      return NextResponse.json(fail('NOT_FOUND', '사용 세션을 찾을 수 없습니다.'), { status: 404 })
    }

    const adminInspect = await db.query.usageSessionChecks.findFirst({
      where: and(
        eq(usageSessionChecks.type, 'admin_inspect'),
        eq(usageSessionChecks.usageSessionId, usageSessionId),
      ),

      orderBy: desc(usageSessionChecks.createdAt),
    })

    // 운전자가 제출한 반납 정보 (사진, 연료 등)
    const driverBefore = await db.query.usageSessionChecks.findFirst({
      where: and(
        eq(usageSessionChecks.type, 'before_drive'),
        eq(usageSessionChecks.usageSessionId, usageSessionId),
      ),

      orderBy: desc(usageSessionChecks.createdAt),
    })

    // 운전자가 제출한 반납 정보 (사진, 연료 등)
    const driverReturn = await db.query.usageSessionChecks.findFirst({
      where: and(
        eq(usageSessionChecks.type, 'after_drive'),
        eq(usageSessionChecks.usageSessionId, usageSessionId),
      ),

      orderBy: desc(usageSessionChecks.createdAt),
    })

    // 사진정보
    const returnPhotos = await db
      .select()
      .from(usageSessionPhotos)
      .where(eq(usageSessionPhotos.usageSessionId, usageSessionId))

    // 서버에서 렌더링하기 전에 미리 URL을 다 변환합니다.
    const returnPhotosWithUrls = await Promise.all(
      returnPhotos.map(async item => ({
        ...item,
        displayUrl: await getStorageUrl('vehicle', item.url, true),
      })),
    )

    // check item
    const checkItems = await db
      .select()
      .from(usageSessionCheckItems)
      .where(eq(usageSessionCheckItems.checkId, adminInspect?.id ?? ''))

    const returnNotes = await db
      .select({
        type: usageSessionChecks.type,
        Note: usageSessionChecks.note,
      })
      .from(usageSessionChecks)
      .where(eq(usageSessionChecks.usageSessionId, usageSessionId))

    const item = {
      ...adminInspect,
      mileages: {
        before: driverBefore?.mileage ?? 0,
        after: driverReturn?.mileage ?? 0,
        admin: adminInspect?.mileage ?? 0,
        driving: (adminInspect?.mileage ?? 0) - (driverBefore?.mileage ?? 0),
      },
      photos: {
        before: returnPhotosWithUrls.filter(p => p.type === 'before_drive').map(p => p.displayUrl),
        after: returnPhotosWithUrls.filter(p => p.type === 'after_drive').map(p => p.displayUrl),
        admin: returnPhotosWithUrls.filter(p => p.type === 'admin_inspect').map(p => p.displayUrl),
      },
      fuel: {
        is_fueled: driverReturn?.isFueled ?? false,
        fuel_amount: driverReturn?.fuelAmount ?? 0,
      },
      selections: checkItems.reduce(
        (acc, v) => {
          acc[v.key] = v.value
          return acc
        },
        {} as Record<string, boolean>,
      ),
      notes: {
        before: returnNotes.filter(n => n.type === 'before_drive').map(n => n.Note)[0] ?? '',
        after: returnNotes.filter(n => n.type === 'after_drive').map(n => n.Note)[0] ?? '',
        admin: returnNotes.filter(n => n.type === 'admin_inspect').map(n => n.Note)[0] ?? '',
      },
    }

    return NextResponse.json(ok({ item }))
  } catch (error) {
    console.error(error)
    return NextResponse.json(fail('INTERNAL_ERROR', '서버 오류가 발생했습니다.'), { status: 500 })
  }
}
