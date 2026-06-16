export function formatTime(dep) {
  if (!dep.departureTime) return '—'

  const now = Date.now()
  const departureMs = new Date(dep.departureTime).getTime()
  const minutesUntil = Math.ceil((departureMs - now) / 60000)

  if (minutesUntil <= 0) return 'Nu'
  if (minutesUntil < 60) return `${minutesUntil} min`
  return new Date(dep.departureTime).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
}
