import { useEffect, useState } from 'react'

const STORAGE_KEY = 'desi-radio-session'
const BASE_LISTENERS = 127

function getSessionId(): string {
  let id = sessionStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(STORAGE_KEY, id)
  }
  return id
}

export function useLiveListeners(isPlaying: boolean) {
  const [count, setCount] = useState(BASE_LISTENERS)

  useEffect(() => {
    getSessionId()

    const tick = () => {
      setCount((prev) => {
        const drift = Math.floor(Math.random() * 7) - 3
        const playingBoost = isPlaying ? 2 : -1
        const next = prev + drift + playingBoost
        return Math.max(42, Math.min(999, next))
      })
    }

    tick()
    const id = setInterval(tick, 4000 + Math.random() * 3000)
    return () => clearInterval(id)
  }, [isPlaying])

  return count
}
