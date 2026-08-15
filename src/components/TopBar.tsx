import { useLiveClock } from '../hooks/useLiveClock'
import { useKmDriven } from '../hooks/useKmDriven'
import { useLiveListeners } from '../hooks/useLiveListeners'

type Props = {
  isPlaying: boolean
  shuffle: boolean
  showPlaylist: boolean
  onToggleShuffle: () => void
  onTogglePlaylist: () => void
  onShare: () => void
}

export function TopBar({
  isPlaying,
  shuffle,
  showPlaylist,
  onToggleShuffle,
  onTogglePlaylist,
  onShare,
}: Props) {
  const { time } = useLiveClock()
  const km = useKmDriven(isPlaying)
  const listeners = useLiveListeners(isPlaying)

  return (
    <>
      <div className="top-left">
        <p className="top-left__time">{time}</p>
        <p className="top-left__km">
          <svg className="top-left__diamond" viewBox="0 0 12 12" width="10" height="10">
            <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="currentColor" />
          </svg>
          {Math.floor(km)} km driven
        </p>
        <p className="top-left__listeners">
          <span className="top-left__live-dot" />
          {listeners} live sun rahe hain
        </p>
      </div>

      <div className="top-center">
        <button
          type="button"
          className={`top-center__btn${shuffle ? ' top-center__btn--active' : ''}`}
          onClick={onToggleShuffle}
          aria-label="Shuffle"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
        </button>
        <button
          type="button"
          className={`top-center__btn${showPlaylist ? ' top-center__btn--active' : ''}`}
          onClick={onTogglePlaylist}
          aria-label="Playlist"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
          </svg>
        </button>
        <button type="button" className="top-center__btn" onClick={onShare} aria-label="Share">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
          </svg>
        </button>
      </div>
    </>
  )
}
