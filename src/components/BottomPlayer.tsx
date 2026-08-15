import type { MusicPlayerState, Track } from '../types/youtube'
import { formatTime } from '../utils/playlist'

type Props = {
  state: MusicPlayerState
  currentTrack: Track | null
  loading: boolean
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrev: () => void
  onSeek: (seconds: number) => void
}

export function BottomPlayer({
  state,
  currentTrack,
  loading,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onSeek,
}: Props) {
  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0

  const handleProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = Number(e.target.value)
    onSeek((pct / 100) * state.duration)
  }

  if (loading) {
    return (
      <div className="bottom-player bottom-player--loading">
        <span className="bottom-player__loading-text">Loading playlist...</span>
      </div>
    )
  }

  if (!state.isReady) return null

  return (
    <div className="bottom-player">
      <div className="bottom-player__art">
        {currentTrack ? (
          <img src={currentTrack.thumbnail} alt="" className="bottom-player__thumb" />
        ) : (
          <div className="bottom-player__thumb bottom-player__thumb--empty" />
        )}
      </div>

      <div className="bottom-player__meta">
        <p className="bottom-player__title">{currentTrack?.title ?? 'Loading...'}</p>
        <p className="bottom-player__artist">{currentTrack?.artist ?? ''}</p>
        <div className="bottom-player__progress-wrap">
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={handleProgress}
            className="bottom-player__progress"
            aria-label="Seek"
            style={{ '--progress': `${progress}%` } as React.CSSProperties}
          />
          <span className="bottom-player__time">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </span>
        </div>
      </div>

      <div className="bottom-player__controls">
        <button type="button" className="bottom-player__btn" onClick={onPrev} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
          </svg>
        </button>
        <button
          type="button"
          className="bottom-player__btn bottom-player__btn--play"
          onClick={state.isPlaying ? onPause : onPlay}
          aria-label={state.isPlaying ? 'Pause' : 'Play'}
        >
          {state.isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          )}
        </button>
        <button type="button" className="bottom-player__btn" onClick={onNext} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M6 18l8.5-6L6 6v12zm2-6v0zm3.5 0L18 12V6l-6.5 6zM16 18h2V6h-2v12z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
