import { useState, useEffect } from 'react'

export function useCountdown(targetTime) {
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetTime) - new Date()
      if (diff <= 0) {
        setMinutes(0)
        setSeconds(0)
        return
      }
      setMinutes(Math.floor(diff / 60000))
      setSeconds(Math.floor((diff % 60000) / 1000))
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [targetTime])

  return { minutes, seconds }
}
