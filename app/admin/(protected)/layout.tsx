import QueryProvider from '@/lib/react-query/query-provider'

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <div className="relative min-h-screen flex flex-col bg-gray-100 max-w-md mx-auto">
        {children}
      </div>
    </QueryProvider>
  )
}
