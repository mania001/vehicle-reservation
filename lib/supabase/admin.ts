import { createClient } from '@supabase/supabase-js'

export const createAdminClient = async () => {
  // 주의: 환경변수 이름은 본인의 설정에 맞추세요.
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!, // Anon Key가 아닌 Service Role Key 사용
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
