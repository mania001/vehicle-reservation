'use server'

import { db } from '@/db'
import { pendingAdminInvites } from '@/db/schema/pending-admin-invites'
import { createAdminClient } from '@/lib/supabase/admin'

export async function inviteAdmin({
  email,
  name,
  role,
}: {
  email: string
  name: string
  role: 'reservation_manager' | 'vehicle_manager' | 'super_admin'
}) {
  // 1 DB에 초대 정보 저장
  await db.insert(pendingAdminInvites).values({
    email,
    name,
    role,
  })

  const supabase = await createAdminClient()

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/auth/callback?email=${encodeURIComponent(email)}`,
    data: { name, role },
  })

  if (error) return { success: false, message: error.message }
  return { success: true, data }
}
