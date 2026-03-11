import { requireAdmin } from '@/lib/admin/require-admin'
import QueryProvider from '@/lib/react-query/query-provider'

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  // 관리자 인증 요구
  const admin = await requireAdmin()

  console.log(admin)

  return (
    <QueryProvider>
      <div className="relative min-h-screen flex flex-col bg-gray-100 max-w-md mx-auto">
        {children}
      </div>
    </QueryProvider>
  )
}
