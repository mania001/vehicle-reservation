'use server'

import { createClient } from '@/lib/supabase/server'
import { LoginFormValues, loginSchema } from '../schema/login-schema'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { adminProfiles } from '@/db/schema'

export async function adminLogin(values: LoginFormValues) {
  const parsed = loginSchema.parse(values)

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword(parsed)

  if (error || !data.user) {
    return {
      success: false,
      message: '이메일 또는 비밀번호가 올바르지 않습니다.',
    }
  }

  const admin = await db.query.adminProfiles.findFirst({
    where: eq(adminProfiles?.id, data.user.id),
  })

  if (!admin) {
    return { success: false, message: '관리자 계정이 존재하지 않습니다.' }
  }

  if (!admin.isActive) {
    return { success: false, message: '아직 승인되지 않은 관리자 계정입니다.' }
  }

  return {
    success: true,
  }
}
