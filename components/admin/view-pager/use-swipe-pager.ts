'use client'

import { useRef } from 'react'

type SwipeOptions = {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  threshold?: number
}

export function useSwipePager({ onSwipeLeft, onSwipeRight, threshold = 60 }: SwipeOptions) {
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null || startY.current === null) return

    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY

    const dx = endX - startX.current
    const dy = endY - startY.current

    // 세로 스크롤이 더 크면 swipe로 인정하지 않음
    if (Math.abs(dy) > Math.abs(dx)) return

    if (dx < -threshold) {
      onSwipeLeft()
    }

    if (dx > threshold) {
      onSwipeRight()
    }

    startX.current = null
    startY.current = null
  }

  return {
    onTouchStart,
    onTouchEnd,
  }
}
