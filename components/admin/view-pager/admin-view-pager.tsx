'use client'

import { useMemo, useState } from 'react'
import { AdminTabItem } from './types'
import { useSwipePager } from './use-swipe-pager'
import { AdminViewPagerTabs } from './admin-view-pager-tabs'
import { motion, AnimatePresence } from 'framer-motion'
import { MainSection } from '../common/main-section'

type Props<TTabId extends string> = {
  tabs: AdminTabItem<TTabId>[]
  defaultTab: TTabId
  render: (tab: TTabId) => React.ReactNode
}

export function AdminViewPager<TTabId extends string>({ tabs, defaultTab, render }: Props<TTabId>) {
  const tabIds = useMemo(() => tabs.map(t => t.id), [tabs])

  const [activeTab, setActiveTab] = useState<TTabId>(defaultTab)
  const [direction, setDirection] = useState(0)

  const activeIndex = tabIds.indexOf(activeTab)

  const goToTab = (nextTab: TTabId) => {
    const nextIndex = tabIds.indexOf(nextTab)
    setDirection(nextIndex > activeIndex ? 1 : -1)
    setActiveTab(nextTab)
  }

  const swipe = useSwipePager({
    onSwipeLeft: () => {
      if (activeIndex < tabIds.length - 1) {
        const nextTab = tabIds[activeIndex + 1]
        setDirection(1)
        setActiveTab(nextTab)
      }
    },
    onSwipeRight: () => {
      if (activeIndex > 0) {
        const prevTab = tabIds[activeIndex - 1]
        setDirection(-1)
        setActiveTab(prevTab)
      }
    },
  })

  return (
    <div className="flex flex-col h-full">
      <AdminViewPagerTabs tabs={tabs} activeTab={activeTab} onChangeTab={goToTab} />
      <MainSection tab>
        <div className="flex-1 overflow-hidden" {...swipe}>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              initial={{ x: direction > 0 ? 60 : -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -60 : 60, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {render(activeTab)}
            </motion.div>
          </AnimatePresence>
        </div>
      </MainSection>
    </div>
  )
}
