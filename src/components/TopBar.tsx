import { useLiveClock } from "../hooks/useLiveClock";
import { useLiveListeners } from "../hooks/useLiveListeners";

type Props = {
  isPlaying: boolean;
  shuffle: boolean;
  showPlaylist: boolean;
  onToggleShuffle: () => void;
  onTogglePlaylist: () => void;
  onShare: () => void;
};

export function TopBar({
  isPlaying,
  shuffle,
  showPlaylist,
  onToggleShuffle,
  onTogglePlaylist,
  onShare,
}: Props) {
  const { time } = useLiveClock();
  const listeners = useLiveListeners(isPlaying);

  return (
    <>
      {/* Top Left */}
      <div className="top-left">
        <p className="top-left__time">{time}</p>

        <p className="top-left__km">
          <svg
            className="top-left__diamond"
            viewBox="0 0 12 12"
            width="10"
            height="10"
          >
            <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="currentColor" />
          </svg>
        </p>

        <p className="top-left__listeners">
          <span className="top-left__live-dot" />
          {listeners} live sun rahe hain
        </p>
      </div>

      {/* Top Center */}
      <div className="top-center">
        {/* Shuffle */}
        <button
          type="button"
          className={`top-center__btn${
            shuffle ? " top-center__btn--active" : ""
          }`}
          onClick={onToggleShuffle}
          aria-label="Shuffle"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="18"
            height="18"
          >
            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
        </button>

        {/* Playlist */}
        <button
          type="button"
          className={`top-center__btn${
            showPlaylist ? " top-center__btn--active" : ""
          }`}
          onClick={onTogglePlaylist}
          aria-label="Playlist"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
          </svg>
        </button>

        {/* Share */}
        <button
          type="button"
          className="top-center__btn"
          onClick={onShare}
          aria-label="Share"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="18"
            height="18"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
          </svg>
        </button>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/i_am_aditya_140/"
          target="_blank"
          rel="noopener noreferrer"
          className="top-center__btn"
          aria-label="Instagram"
          title="Instagram"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="18"
            height="18"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle
              cx="17.5"
              cy="6.5"
              r="1"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </a>
      </div>

      {/* Creator Name */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: "10px",
          transform: "translateX(-50%)",
          zIndex: 9999,
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
          textShadow: "0 1px 6px rgba(0, 0, 0, 0.8)",
          pointerEvents: "none",
        }}
      >
        Aditya Khote
      </div>
    </>
  );
}
