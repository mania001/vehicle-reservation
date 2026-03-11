import { NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  // update user's auth session
  const response = await updateSession(request)

  // 🔑 현재 pathname 주입
  response.headers.set('x-pathname', request.nextUrl.pathname)

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
