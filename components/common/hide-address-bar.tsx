'use client'

import { useEffect } from 'react'

export function HideAddressBar() {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 1)
    }, 100)
  }, [])

  return null
}
