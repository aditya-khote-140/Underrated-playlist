import { useCallback, useEffect, useRef, useState } from 'react'
import type { MusicPlayerState, Track, YTPlayer } from '../types/youtube'
import { YTPlayerState } from '../types/youtube'
import { fetchTrackMeta } from '../utils/playlist'

const YT_SCRIPT_ID = 'youtube-iframe-api'

function loadYouTubeScript(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve()

  return new Promise((resolve) => {
    const existing = document.getElementById(YT_SCRIPT_ID)
    if (existing) {
      window.onYouTubeIframeAPIReady = () => resolve()
      return
    }

    window.onYouTubeIframeAPIReady = () => resolve()
    const script = document.createElement('script')
    script.id = YT_SCRIPT_ID
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })
}

const initialState: MusicPlayerState = {
  isReady: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  currentIndex: 0,
  volume: 70,
  isMuted: false,
}

export function useYouTubePlayer(containerId: string) {
  const playerRef = useRef<YTPlayer | null>(null)
  const [state, setState] = useState<MusicPlayerState>(initialState)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const tickRef = useRef<number | null>(null)

  const stopTick = useCallback(() => {
    if (tickRef.current !== null) {
      cancelAnimationFrame(tickRef.current)
      tickRef.current = null
    }
  }, [])

  const startTick = useCallback(() => {
    stopTick()
    const tick = () => {
      const player = playerRef.current
      if (player?.getCurrentTime) {
        setState((prev) => ({
          ...prev,
          currentTime: player.getCurrentTime(),
          duration: player.getDuration() || prev.duration,
        }))
      }
      tickRef.current = requestAnimationFrame(tick)
    }
    tickRef.current = requestAnimationFrame(tick)
  }, [stopTick])

  const loadPlaylistMeta = useCallback(async (videoIds: string[]) => {
  const meta = await Promise.all(
    videoIds.map(async (id) => {
      const { title, artist, thumbnail } = await fetchTrackMeta(id)
      return { id, title, artist, thumbnail }
    }),
  )

  setTracks(meta)
}, [])

  const loadPlaylist = useCallback(
    async (playlistId: string) => {
      setLoading(true)
      setError(null)
      setTracks([])
      setState(initialState)

      try {
        await loadYouTubeScript()

        if (playerRef.current) {
          playerRef.current.destroy()
          playerRef.current = null
        }

        await new Promise<void>((resolve, reject) => {
          playerRef.current = new window.YT.Player(containerId, {
            height: "0",
            width: "0",
            playerVars: {
              listType: "playlist",
              list: playlistId,
              autoplay: 0,
              controls: 0,
              modestbranding: 1,
              rel: 0,
            },
            events: {
              onReady: (event) => {
                event.target.setVolume(70);
                const ids = event.target.getPlaylist() ?? [];
                if (ids.length === 0) {
                  reject(new Error("Playlist is empty or unavailable"));
                  return;
                }
                void loadPlaylistMeta(ids);
                setState((prev) => ({
                  ...prev,
                  isReady: true,
                  volume: 70,
                  currentIndex: event.target.getPlaylistIndex(),
                }));
                resolve();
              },
              onStateChange: (event) => {
                const playing = event.data === YTPlayerState.PLAYING;
                setState((prev) => ({
                  ...prev,
                  isPlaying: playing,
                  currentIndex: event.target.getPlaylistIndex(),
                }));
                if (playing) startTick();
                else stopTick();
              },
              onError: () => {
                reject(
                  new Error(
                    "Could not load playlist. Check the URL and try again.",
                  ),
                );
              },
            },
          });
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load playlist')
      } finally {
        setLoading(false)
      }
    },
    [containerId, loadPlaylistMeta, startTick, stopTick],
  )

  const play = useCallback(() => playerRef.current?.playVideo(), [])
  const pause = useCallback(() => playerRef.current?.pauseVideo(), [])
  const next = useCallback(() => playerRef.current?.nextVideo(), [])
  const prev = useCallback(() => playerRef.current?.previousVideo(), [])
  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true)
  }, [])
  const setVolume = useCallback((volume: number) => {
    playerRef.current?.setVolume(volume)
    setState((prev) => ({ ...prev, volume, isMuted: volume === 0 }))
  }, [])
  const toggleMute = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    if (player.isMuted()) {
      player.unMute()
      setState((prev) => ({ ...prev, isMuted: false }))
    } else {
      player.mute()
      setState((prev) => ({ ...prev, isMuted: true }))
    }
  }, [])
  const playAt = useCallback((index: number) => {
    playerRef.current?.playVideoAt(index)
  }, [])

  useEffect(() => {
    return () => {
      stopTick()
      playerRef.current?.destroy()
    }
  }, [stopTick])

  const currentTrack = tracks[state.currentIndex] ?? null

  return {
    state,
    tracks,
    currentTrack,
    loading,
    error,
    loadPlaylist,
    play,
    pause,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    playAt,
  }
}
