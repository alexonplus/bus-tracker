let watched = []

export const addWatchedBus = (busLine, stopName, departureTime) => {
  watched.push({
    id: Date.now(),
    busLine,
    stopName,
    departureTime: new Date(departureTime).getTime(),
  })
}

export const getWatchedBuses = () => watched

export const removeWatchedBus = (id) => {
  watched = watched.filter(b => b.id !== id)
}

export const checkWatchedBuses = () => {
  const now = Date.now()
  const toNotify = []

  watched = watched.filter(bus => {
    const minutesUntil = (bus.departureTime - now) / 60000
    if (minutesUntil <= 5 && minutesUntil > 0) {
      toNotify.push(bus)
      return false
    }
    return minutesUntil > 0
  })

  return toNotify
}
