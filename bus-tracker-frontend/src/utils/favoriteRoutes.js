const STORAGE_KEY = 'bus_tracker_favorite_routes'
const MAX_FAVORITES = 20

export const getFavoriteRoutes = () => {
  try {
    const favorites = localStorage.getItem(STORAGE_KEY)
    return favorites ? JSON.parse(favorites) : []
  } catch (e) {
    return []
  }
}

export const addFavoriteRoute = (route) => {
  if (!route || !route.from || !route.to) return false

  const favorites = getFavoriteRoutes()
  const exists = favorites.some(
    r => r.from === route.from && r.to === route.to
  )

  if (exists) return false

  const newRoute = {
    id: Date.now(),
    from: route.from,
    to: route.to,
    fromId: route.fromId,
    toId: route.toId,
    savedAt: new Date().toISOString(),
  }

  const updated = [newRoute, ...favorites].slice(0, MAX_FAVORITES)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return true
}

export const removeFavoriteRoute = (routeId) => {
  const favorites = getFavoriteRoutes()
  const updated = favorites.filter(r => r.id !== routeId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export const isFavorite = (from, to) => {
  const favorites = getFavoriteRoutes()
  return favorites.some(r => r.from === from && r.to === to)
}

export const clearFavoriteRoutes = () => {
  localStorage.removeItem(STORAGE_KEY)
}
