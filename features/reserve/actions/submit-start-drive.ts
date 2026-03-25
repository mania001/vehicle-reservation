'use server'

import { db } from '@/db'
import { usageSessionChecks, usageSessionPhotos, usageSessions } from '@/db/schema'
import { uploadMultipleFiles } from '@/lib/supabase/storage'
import { eq } from 'drizzle-orm'

export async function submitStartDrive({
  usageSessionId,
  mileage,
  fuelLevel,
  note,
  photos,
}: {
  usageSessionId: string
  mileage: number
  fuelLevel: number
  note?: string
  photos: File[]
}) {
  try {
    // 유틸리티 호출: 일괄 업로드 및 URL 획득
    const uploadResults = await uploadMultipleFiles(
      photos,
      'vehicle',
      `usage/${usageSessionId}/start`,
    )

    // DB에는 path 배열이나 publicUrl 배열 중 선택해서 저장
    const photoUrls = uploadResults.map(res => res.path)

    await db.transaction(async tx => {
      const [check] = await tx
        .insert(usageSessionChecks)
        .values({
          usageSessionId,
          type: 'before_drive',
          mileage,
          fuelLevel,
          note,
        })
        .returning()

      if (photoUrls.length > 0) {
        await tx.insert(usageSessionPhotos).values(
          photoUrls.map(url => ({
            checkId: check.id,
            usageSessionId,
            type: 'before_drive',
            url,
          })),
        )
      }

      await tx
        .update(usageSessions)
        .set({
          beforeDriveChecked: true,
          updatedAt: new Date(),
        })
        .where(eq(usageSessions.id, usageSessionId))
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to start usage:', error)
    return { success: false, error: '운행 시작 기록에 실패했습니다.' }
  }
}
