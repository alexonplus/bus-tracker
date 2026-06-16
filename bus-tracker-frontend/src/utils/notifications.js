import { playNotificationSound } from './sound'

const STORAGE_KEY = 'bus_tracker_notifications'

export const createNotification = (options) => {
  return {
    id: Date.now(),
    type: options.type || 'info', // info, success, warning, error
    title: options.title,
    message: options.message,
    duration: options.duration || 5000,
    createdAt: new Date().toISOString(),
  }
}

export const showNotification = (options) => {
  const notification = createNotification(options)

  // Play sound
  try {
    playNotificationSound()
  } catch (e) {
    console.log('Sound not available')
  }

  // Dispatch custom event
  window.dispatchEvent(
    new CustomEvent('notification', { detail: notification })
  )

  return notification.id
}

export const notificationTypes = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  NEARBY: 'nearby', // Custom type for "bus nearby"
}

export const notifications = {
  stopSaved: (stopName) =>
    showNotification({
      type: notificationTypes.SUCCESS,
      title: 'Stop saved',
      message: stopName,
      duration: 4000,
    }),

  busNearby: (busLine, minutes) =>
    showNotification({
      type: notificationTypes.NEARBY,
      title: `Bus ${busLine} arriving soon`,
      message: `${minutes} minute${minutes !== 1 ? 's' : ''} away`,
      duration: 6000,
    }),

  routeSaved: (from, to) =>
    showNotification({
      type: notificationTypes.SUCCESS,
      title: 'Route saved',
      message: `${from} → ${to}`,
      duration: 4000,
    }),

  error: (message) =>
    showNotification({
      type: notificationTypes.ERROR,
      title: 'Error',
      message,
      duration: 6000,
    }),

  searchHistoryCleared: () =>
    showNotification({
      type: notificationTypes.INFO,
      title: 'History cleared',
      duration: 3000,
    }),
}
