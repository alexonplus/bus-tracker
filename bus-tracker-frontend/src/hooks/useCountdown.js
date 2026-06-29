import { useState, useEffect } from 'react'

export function useCountdown(targetTime) {
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const target = new Date(targetTime)
      const diff = target - now

      if (diff <= 0) {
        setMinutes(0)
        setSeconds(0)
        return
      }

      const totalSeconds = Math.floor(diff / 1000)
      const mins = Math.floor(totalSeconds / 60)
      const secs = totalSeconds % 60

      setMinutes(mins)
      setSeconds(secs)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [targetTime])

  return { minutes, seconds }
}