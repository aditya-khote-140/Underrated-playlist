import { useDesiQuote } from '../hooks/useDesiQuote'

export function DesiQuoteOverlay() {
  const quote = useDesiQuote(10000)

  return (
    <div className="desi-overlay" key={quote.text}>
      <p className="desi-overlay__text">"{quote.text}"</p>
    </div>
  )
}
