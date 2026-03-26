'use server'

import { db } from '@/db'

export async function getStartDriveInfo(usageSessionId: string) {
  try {
    const startInfo = await db.query.usageSessionChecks.findFirst({
      where: (checks, { and, eq }) =>
        and(eq(checks.usageSessionId, usageSessionId), eq(checks.type, 'before_drive')),
      orderBy: (checks, { desc }) => [desc(checks.createdAt)],
    })

    return { success: true, data: startInfo }
  } catch (_error) {
    return { success: false, error: '시작 정보를 가져오지 못했습니다.' }
  }
}
