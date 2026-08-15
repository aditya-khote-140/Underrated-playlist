import type { Track } from '../types/youtube'

type Props = {
  tracks: Track[]
  currentIndex: number
  open: boolean
  onClose: () => void
  onSelect: (index: number) => void
}

export function PlaylistDrawer({ tracks, currentIndex, open, onClose, onSelect }: Props) {
  if (!open) return null

  return (
    <div className="playlist-drawer-backdrop" onClick={onClose}>
      <aside className="playlist-drawer" onClick={(e) => e.stopPropagation()}>
        <header className="playlist-drawer__header">
          <h2>Bollywood Duets</h2>
          <button type="button" className="playlist-drawer__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        <ul className="playlist-drawer__list">
          {tracks.map((track, index) => (
            <li key={`${track.id}-${index}`}>
              <button
                type="button"
                className={`playlist-drawer__item${index === currentIndex ? ' playlist-drawer__item--active' : ''}`}
                onClick={() => {
                  onSelect(index)
                  onClose()
                }}
              >
                <img src={track.thumbnail} alt="" className="playlist-drawer__thumb" />
                <div className="playlist-drawer__info">
                  <span className="playlist-drawer__title">{track.title}</span>
                  <span className="playlist-drawer__artist">{track.artist}</span>
                </div>
                {index === currentIndex && <span className="playlist-drawer__now">♫</span>}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
