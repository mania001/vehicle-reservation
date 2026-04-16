import { StackRouteTransition } from '../transition/stack-route-transition'
import { AdminStackHeader } from './admin-stack-header'

export function AdminStackShell({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <>
      <AdminStackHeader title={title} />

      <main className="px-4 pt-14">
        <StackRouteTransition>{children}</StackRouteTransition>
      </main>
    </>
  )
}
