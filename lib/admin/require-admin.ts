import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '../supabase/server'
import { db } from '@/db'
import { adminProfiles } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. 로그인 안 됨
  if (!user) redirect('/admin/login')

  // 2. admins 테이블 확인
  const admin = await db.query.adminProfiles.findFirst({
    where: eq(adminProfiles.id, user.id),
  })

  if (!admin) redirect('/admin/login')

  // 3. 승인 안 됨
  if (!admin.isActive) redirect('/admin/pending')

  return {
    id: admin.id,
    role: admin.role,
    email: user.email!,
    name: admin.name ?? 'Admin',
    thumbnail: user.user_metadata?.avatar_url ?? null,
  }
}
