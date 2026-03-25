'use server'

import { db } from '@/db'
import { usageSessionChecks, usageSessionPhotos, usageSessions } from '@/db/schema'
import { uploadMultipleFiles } from '@/lib/supabase/storage'
import { eq } from 'drizzle-orm'

export async function submitReturnDrive({
  usageSessionId,
  mileage,
  fuelLevel,
  parkingZone, // 주차 층 (예: B2)
  parkingNumber, // 주차 구역 (예: 105)
  note,
  photos,
}: {
  usageSessionId: string
  mileage: number
  fuelLevel: number
  parkingZone: string
  parkingNumber: string
  note?: string
  photos: File[]
}) {
  try {
    // 유틸리티 호출: 일괄 업로드 및 URL 획득
    const uploadResults = await uploadMultipleFiles(
      photos,
      'vehicle',
      `usage/${usageSessionId}/return`,
    )

    // DB에는 path 배열이나 publicUrl 배열 중 선택해서 저장
    const photoUrls = uploadResults.map(res => res.path)

    // 2. DB 트랜잭션
    await db.transaction(async tx => {
      // [A] 반납 점검 로그 생성 (after_drive)
      const [check] = await tx
        .insert(usageSessionChecks)
        .values({
          usageSessionId,
          type: 'after_drive',
          mileage,
          fuelLevel,
          parkingZone, // 주차 정보 기록
          parkingNumber,
          note,
        })
        .returning()

      // [B] 사진 데이터 저장
      if (photoUrls.length > 0) {
        await tx.insert(usageSessionPhotos).values(
          photoUrls.map(path => ({
            checkId: check.id,
            usageSessionId,
            type: 'after_drive',
            url: path,
          })),
        )
      }

      // [C] 이용 세션 상태 업데이트: 'returned'
      await tx
        .update(usageSessions)
        .set({
          status: 'returned', // 사용자가 반납함
          updatedAt: new Date(),
        })
        .where(eq(usageSessions.id, usageSessionId))
    })

    return { success: true }
  } catch (error) {
    console.error('Return drive error:', error)
    return { success: false, error: '반납 처리에 실패했습니다.' }
  }
}
