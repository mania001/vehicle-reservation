import { AdminStackShell } from '@/features/admin/layout/admin-stack-shell'

export default function AdminStackLayout({ children }: { children: React.ReactNode }) {
  return <AdminStackShell>{children}</AdminStackShell>
}
