import { useEffect, useState } from 'react'
import { desiQuotes, type DesiQuote } from '../data/desiQuotes'

export function useDesiQuote(intervalMs = 8000) {
  const [quote, setQuote] = useState<DesiQuote>(() => {
    const idx = Math.floor(Math.random() * desiQuotes.length)
    return desiQuotes[idx]
  })

  useEffect(() => {
    const id = setInterval(() => {
      setQuote((prev) => {
        let next = desiQuotes[Math.floor(Math.random() * desiQuotes.length)]
        while (next.text === prev.text && desiQuotes.length > 1) {
          next = desiQuotes[Math.floor(Math.random() * desiQuotes.length)]
        }
        return next
      })
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return quote
}
