import { useState } from 'react'
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
  const [volume, setVolume] = useState(100)
  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0

  const handleProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = Number(e.target.value)
    onSeek((pct / 100) * state.duration)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVolume = Number(e.target.value)
    setVolume(nextVolume)
    window.dispatchEvent(new CustomEvent('youtube-volume-change', { detail: nextVolume }))
  }

  const handleMute = () => {
    const nextVolume = volume === 0 ? 100 : 0
    setVolume(nextVolume)
    window.dispatchEvent(new CustomEvent('youtube-volume-change', { detail: nextVolume }))
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
        <span className="bottom-player__time">
          {formatTime(state.currentTime)} / {formatTime(state.duration)}
        </span>
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
            <path d="M6 18l8.5-6L6 6v12zm3.5-6L18 6v12l-8.5-6zM16 6h2v12h-2V6z" />
          </svg>
        </button>

        <div className="bottom-player__volume">
          <button
            type="button"
            className="bottom-player__btn bottom-player__volume-btn"
            onClick={handleMute}
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              {volume === 0 ? (
                <path d="M4 9v6h4l5 4V5L8 9H4l-4 3 4 3v-6zm11 1 4-4 1.5 1.5-4 4 4 4L19 17l-4-4-4 4-1.5-1.5 4-4-4-4L11 6.5l4 3.5z" />
              ) : (
                <path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3c0-1.77-1-3.29-2.5-4.03v8.06c1.5-.74 2.5-2.26 2.5-4.03zm2.5 0c0 2.77-1.5 5.18-3.73 6.47v1.7C18.11 18.8 20.5 15.9 20.5 12s-2.39-6.8-5.23-8.17v1.7C18.5 6.82 20 9.23 20 12z" />
              )}
            </svg>
          </button>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={handleVolumeChange}
            className="bottom-player__volume-slider"
            style={{ '--volume': `${volume}%` } as React.CSSProperties}
            aria-label="Volume"
          />
        </div>
      </div>

      <div className="bottom-player__progress-wrap">
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onChange={handleProgress}
          className="bottom-player__progress"
          style={{ '--progress': `${progress}%` } as React.CSSProperties}
          aria-label="Seek through song"
        />
      </div>
    </div>
  )
}
