import { useState, useEffect } from 'react'
import { getFavoriteRoutes, removeFavoriteRoute } from '../utils/favoriteRoutes'

export default function FavoriteRoutes({ onSelect, onClose }) {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    setFavorites(getFavoriteRoutes())
  }, [])

  const handleSelect = (route) => {
    onSelect(route)
    onClose?.()
  }

  const handleRemove = (e, routeId) => {
    e.stopPropagation()
    removeFavoriteRoute(routeId)
    setFavorites(getFavoriteRoutes())
  }

  if (favorites.length === 0) {
    return (
      <div className="favorite-routes empty">
        <p>No favorite routes yet</p>
      </div>
    )
  }

  return (
    <div className="favorite-routes">
      <h3>Favorite routes</h3>
      <ul className="routes-list">
        {favorites.map(route => (
          <li key={route.id} onClick={() => handleSelect(route)} className="route-item">
            <div className="route-info">
              <div className="route-direction">
                <span className="from">{route.from}</span>
                <span className="arrow">→</span>
                <span className="to">{route.to}</span>
              </div>
              <div className="route-saved">
                Saved {new Date(route.savedAt).toLocaleDateString('sv-SE')}
              </div>
            </div>
            <button
              onClick={(e) => handleRemove(e, route.id)}
              className="remove-route-btn"
              title="Remove from favorites"
            >
              ★
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
