'use client'
import { useState, type MouseEvent } from 'react'

const MOBILE_QUERY = '(max-width: 767px)'

export const useMobileBlockDialog = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (event: MouseEvent) => {
    if (window.matchMedia(MOBILE_QUERY).matches) {
      event.preventDefault()
      setIsOpen(true)
    }
  }

  return { isOpen, setIsOpen, handleClick }
}
