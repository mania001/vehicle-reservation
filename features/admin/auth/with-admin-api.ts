import { NextResponse } from 'next/server'
import { requireAdminApi } from './require-admin-api'
import { fail } from '../_shared/api/api-response'
import { AdminRole } from './admin-role'
import { hasRole } from './has-role'

type Handler<T, P> = (ctx: {
  admin: Awaited<ReturnType<typeof requireAdminApi>>
  req: Request
  params: Promise<P>
}) => Promise<T>

type Options = {
  role?: AdminRole
}

export function withAdminApi<T, P extends Record<string, string> = Record<string, string>>(
  handler: Handler<T, P>,
  options?: Options,
) {
  return async (req: Request, context: { params: Promise<P> }) => {
    try {
      const admin = await requireAdminApi()

      if (options?.role && !hasRole(admin, options.role)) {
        return NextResponse.json(fail('FORBIDDEN', '관리자 권한이 없습니다'), { status: 403 })
      }

      return await handler({
        admin,
        req,
        params: context.params,
      })
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'UNAUTHORIZED') {
          return NextResponse.json(fail('UNAUTHORIZED', '로그인이 필요합니다'), { status: 401 })
        }

        if (err.message === 'FORBIDDEN') {
          return NextResponse.json(fail('FORBIDDEN', '관리자 권한이 없습니다'), { status: 403 })
        }
      }

      return NextResponse.json(fail('INTERNAL_ERROR', '서버 오류'), { status: 500 })
    }
  }
}
