import { TabsRouteTransition } from '../transition/tabs-route-transition'
import { AdminBottomNavigation } from './admin-bottom-navigation'
import { AdminHeader } from './admin-header'
// w-full pt-14 pb-16 px-4 max-w-md mx-auto min-h-screen border
export function AdminTabsShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminHeader />

      <main className="flex-1 overflow-y-auto pb-16 pt-14">
        <TabsRouteTransition>{children}</TabsRouteTransition>
      </main>

      <AdminBottomNavigation />
    </>
  )
}
