import { useEffect, useState } from 'react'

export function useKmDriven(isPlaying: boolean) {
  const [km, setKm] = useState(0)

  useEffect(() => {
    if (!isPlaying) return

    const id = setInterval(() => {
      setKm((prev) => Math.round((prev + 0.02) * 100) / 100)
    }, 1000)

    return () => clearInterval(id)
  }, [isPlaying])

  return km
}
