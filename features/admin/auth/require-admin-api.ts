import { db } from '@/db'
import { adminProfiles } from '@/db/schema'
import { createClient } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'

export async function requireAdminApi() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('UNAUTHORIZED')
  }

  const admin = await db.query.adminProfiles.findFirst({
    where: eq(adminProfiles.id, user.id),
  })

  if (!admin || !admin.isActive) {
    throw new Error('FORBIDDEN')
  }

  return {
    id: admin.id,
    role: admin.role,
    email: user.email!,
    name: admin.name ?? 'Admin',
    thumbnail: user.user_metadata?.avatar_url ?? null,
  }
}
