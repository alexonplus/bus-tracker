export function formatTime(dep) {
  const mins = dep.minutesUntilDeparture
  if (mins === 0) return 'Nu'
  if (mins < 60) return `${mins} min`
  return dep.departureTime
    ? new Date(dep.departureTime).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
    : '—'
}
