import { useState, useEffect } from 'react'

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const handleNotification = (event) => {
      const notification = event.detail
      setNotifications(prev => [notification, ...prev])

      if (notification.duration > 0) {
        setTimeout(() => {
          setNotifications(prev =>
            prev.filter(n => n.id !== notification.id)
          )
        }, notification.duration)
      }
    }

    window.addEventListener('notification', handleNotification)
    return () => window.removeEventListener('notification', handleNotification)
  }, [])

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="notification-center">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            {notification.title && (
              <div className="notification-title">{notification.title}</div>
            )}
            {notification.message && (
              <div className="notification-message">{notification.message}</div>
            )}
          </div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
