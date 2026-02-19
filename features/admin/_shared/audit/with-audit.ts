import { createAuditLog, type CreateAuditLogInput } from './create-audit-log'

export type AuditContext = {
  actorId: string | null
  ip: string | null
  userAgent: string | null
}

/**
 * auth 아직 없으므로 actorId는 null로 기본 처리
 * 나중에 requireAdminAuth 구현하면 여기만 바꾸면 됨.
 */
export function getAuditContext(req: Request): AuditContext {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    null

  const userAgent = req.headers.get('user-agent') ?? null

  return {
    actorId: null,
    ip,
    userAgent,
  }
}

export async function withAudit<T>(
  req: Request,
  audit: CreateAuditLogInput,
  fn: () => Promise<T>,
): Promise<T> {
  const result = await fn()

  const ctx = getAuditContext(req)

  await createAuditLog({
    ...audit,
    metadata: {
      ip: ctx.ip!,
      userAgent: ctx.userAgent!,
      requestId: ctx.actorId!, // 나중에 auth 구현하면 actorId로 바꿔야 함
    },
  })

  return result
}
