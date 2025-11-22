import { useEffect, useState } from 'react'
import './Toast.css'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose?: () => void
}

function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onClose?.()
      }, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-visible' : ''}`}>
      <span className="toast-message">{message}</span>
    </div>
  )
}

export default Toast

