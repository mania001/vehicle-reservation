import { requireAdmin } from '@/lib/admin/require-admin'
import QueryProvider from '@/lib/react-query/query-provider'

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  // 관리자 인증 요구
  await requireAdmin()

  return (
    <QueryProvider>
      <div className="relative bg-gray-100 max-w-md mx-auto min-h-screen">{children}</div>
    </QueryProvider>
  )
}
