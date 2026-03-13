'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function reinviteAdmin(email: string) {
  const supabaseAdmin = await createAdminClient()

  // 보안을 위해 실제 초대된 유저 목록에 있는지 확인
  const {
    data: { users },
  } = await supabaseAdmin.auth.admin.listUsers()
  const userExists = users.find(u => u.email === email)

  if (!userExists) {
    return { success: false, message: '초대 목록에 없는 사용자입니다.' }
  }

  // 다시 초대 메일 발송
  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/auth/callback?email=${encodeURIComponent(email)}`,
  })

  if (error) return { success: false, message: error.message }
  return { success: true }
}
