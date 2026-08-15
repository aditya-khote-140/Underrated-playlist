export type Track = {
  id: string
  title: string
  artist: string
  thumbnail: string
}

export type MusicPlayerState = {
  isReady: boolean
  isPlaying: boolean
  currentTime: number
  duration: number
  currentIndex: number
  volume: number
  isMuted: boolean
}

export const YTPlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const

export type YTPlayerStateValue = (typeof YTPlayerState)[keyof typeof YTPlayerState]

export interface YTPlayer {
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  nextVideo(): void
  previousVideo(): void
  seekTo(seconds: number, allowSeekAhead?: boolean): void
  setVolume(volume: number): void
  getVolume(): number
  mute(): void
  unMute(): void
  isMuted(): boolean
  getCurrentTime(): number
  getDuration(): number
  getVideoData(): { video_id: string; title: string; author: string }
  getPlaylist(): string[] | null
  getPlaylistIndex(): number
  loadPlaylist(playlistId: string, index?: number, startSeconds?: number): void
  playVideoAt(index: number): void
  destroy(): void
}

export interface YTPlayerOptions {
  height?: string | number
  width?: string | number
  videoId?: string
  playerVars?: Record<string, string | number>
  events?: {
    onReady?: (event: { target: YTPlayer }) => void
    onStateChange?: (event: { data: YTPlayerStateValue; target: YTPlayer }) => void
    onError?: (event: { data: number }) => void
  }
}

export interface YTGlobal {
  Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer
  PlayerState: typeof YTPlayerState
}

declare global {
  interface Window {
    YT: YTGlobal
    onYouTubeIframeAPIReady: () => void
  }
}
