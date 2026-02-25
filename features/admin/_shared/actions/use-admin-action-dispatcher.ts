'use client'

import { useState } from 'react'
import { AdminBookingItem } from '../types/admin-booking-item'
import { AdminAction } from '../model/admin-state-machine'

export function useAdminActionDispatcher() {
  const [selectedItem, setSelectedItem] = useState<AdminBookingItem | null>(null)

  const [pendingAction, setPendingAction] = useState<AdminAction | null>(null)

  const dispatch = (action: AdminAction, item: AdminBookingItem) => {
    setSelectedItem(item)
    setPendingAction(action)
  }

  const clear = () => {
    setSelectedItem(null)
    setPendingAction(null)
  }

  return {
    selectedItem,
    pendingAction,
    dispatch,
    clear,
  }
}
