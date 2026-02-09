import { cn } from '@/lib/utils'
import { AdminTabItem } from './types'

type Props<TTabId extends string> = {
  tabs: AdminTabItem<TTabId>[]
  activeTab: TTabId
  onChangeTab: (tab: TTabId) => void
}

export function AdminViewPagerTabs<TTabId extends string>({
  tabs,
  activeTab,
  onChangeTab,
}: Props<TTabId>) {
  return (
    <div className="fixed w-full max-w-md top-14 z-20 bg-white">
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3">
        {tabs.map(tab => {
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={cn(
                'shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2',
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
              )}
            >
              <span>{tab.label}</span>

              {typeof tab.badgeCount === 'number' && (
                <span
                  className={cn(
                    'ml-2 inline-flex items-center justify-center text-xs font-bold px-2 py-0.5 rounded-full',
                    isActive ? 'bg-white text-slate-900' : 'bg-white text-slate-700',
                  )}
                >
                  {tab.badgeCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
