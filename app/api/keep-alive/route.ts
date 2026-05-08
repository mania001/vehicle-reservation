import { createClient } from '@/lib/supabase/client'

export async function GET() {
  const supabase = createClient()

  // RPC 방식
  const { error } = await supabase.rpc('heartbeat_rpc')

  if (error) return new Response('error', { status: 500 })
  return new Response('ok', { status: 200 })
}
