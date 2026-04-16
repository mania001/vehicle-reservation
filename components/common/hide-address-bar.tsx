'use client'

import { useEffect } from 'react'

export function HideAddressBar() {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 1)
      setTimeout(() => window.scrollTo(0, 0), 50)
    }, 100)
  }, [])

  return null
}
