import { AdminTabsShell } from '@/features/admin/layout/admin-tabs-shell'

export default function AdminTabsLayout({ children }: { children: React.ReactNode }) {
  return <AdminTabsShell>{children}</AdminTabsShell>
}
