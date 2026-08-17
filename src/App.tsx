import { useCallback, useEffect, useRef, useState } from "react";
import { BottomPlayer } from "./components/BottomPlayer";
import { PlaylistDrawer } from "./components/PlaylistDrawer";
import { TopBar } from "./components/TopBar";
import { DEFAULT_PLAYLIST_ID, DEFAULT_PLAYLIST_URL } from "./config/playlist-config";
import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import "./App.css";

function App() {
  const { loadPlaylist, ...playerControls } = useYouTubePlayer("yt-player");
  const player = { loadPlaylist, ...playerControls };
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    void loadPlaylist(DEFAULT_PLAYLIST_ID);
  }, [loadPlaylist]);

  const handleNext = useCallback(() => {
    if (shuffle && player.tracks.length > 1) {
      let next = Math.floor(Math.random() * player.tracks.length);
      while (next === player.state.currentIndex) {
        next = Math.floor(Math.random() * player.tracks.length);
      }
      player.playAt(next);
    } else {
      player.next();
    }
  }, [shuffle, player]);

  const handleShare = async () => {
    const url = DEFAULT_PLAYLIST_URL;
    if (navigator.share) {
      await navigator.share({ title: "Bollywood Duets Radio", url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="scene">
      <div className="scene__bg" />

      <TopBar
        isPlaying={player.state.isPlaying}
        shuffle={shuffle}
        showPlaylist={showPlaylist}
        onToggleShuffle={() => setShuffle((s) => !s)}
        onTogglePlaylist={() => setShowPlaylist((s) => !s)}
        onShare={() => void handleShare()}
      />


      <div id="yt-player" className="yt-player-hidden" aria-hidden="true" />

      {player.error && <p className="scene__error">{player.error}</p>}

      <BottomPlayer
        state={player.state}
        currentTrack={player.currentTrack}
        loading={player.loading}
        onPlay={player.play}
        onPause={player.pause}
        onNext={handleNext}
        onPrev={player.prev}
        onSeek={player.seek}
      />

      <PlaylistDrawer
        tracks={player.tracks}
        currentIndex={player.state.currentIndex}
        open={showPlaylist}
        onClose={() => setShowPlaylist(false)}
        onSelect={player.playAt}
      />
    </div>
  );
}

export default App;
