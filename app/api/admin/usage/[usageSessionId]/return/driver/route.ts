import { db } from '@/db'
import { usageSessionChecks, usageSessionPhotos, usageSessions } from '@/db/schema'
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

    const lastReturnCheck = await db.query.usageSessionChecks.findFirst({
      where: and(
        eq(usageSessionChecks.type, 'after_drive'),
        eq(usageSessionChecks.usageSessionId, usageSessionId),
      ),

      orderBy: desc(usageSessionChecks.createdAt),
    })

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

    const item = {
      ...lastReturnCheck,
      photos: {
        before: returnPhotosWithUrls.filter(p => p.type === 'before_drive').map(p => p.displayUrl),
        after: returnPhotosWithUrls.filter(p => p.type === 'after_drive').map(p => p.displayUrl),
      },
    }

    return NextResponse.json(ok({ item }))
  } catch (error) {
    console.error(error)
    return NextResponse.json(fail('INTERNAL_ERROR', '서버 오류가 발생했습니다.'), { status: 500 })
  }
}
