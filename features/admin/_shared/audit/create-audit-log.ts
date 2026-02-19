import { db } from '@/db'
import { auditLogs } from '@/db/schema'

export type CreateAuditLogInput = {
  reservationId: string
  action: typeof auditLogs.$inferInsert.action

  entityType: typeof auditLogs.$inferInsert.entityType
  entityId: string

  actorType: typeof auditLogs.$inferInsert.actorType
  actorId?: string | null

  message?: string | null

  prevData?: unknown
  nextData?: unknown

  metadata?: {
    ip?: string
    userAgent?: string
    requestId?: string
  }
}

export async function createAuditLog(input: CreateAuditLogInput) {
  await db.insert(auditLogs).values({
    reservationId: input.reservationId, // reservationId는 audit log의 "Master Key" 역할, 모든 로그는 reservationId로 연결되어야 함
    action: input.action,

    entityType: input.entityType,
    entityId: input.entityId,

    actorType: input.actorType,
    actorId: input.actorId ?? null,

    message: input.message ?? null,

    prevData: input.prevData ?? null,
    nextData: input.nextData ?? null,

    metadata: input.metadata ?? null,
  })
}
