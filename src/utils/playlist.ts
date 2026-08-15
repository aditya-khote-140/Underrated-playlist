export function extractPlaylistId(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const listMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/)
  if (listMatch) return listMatch[1]

  if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) return trimmed

  return null
}

export function parseTrackTitle(raw: string): { title: string; artist: string } {
  const separators = [' - ', ' | ', ' – ']
  for (const sep of separators) {
    const idx = raw.indexOf(sep)
    if (idx > 0) {
      return {
        title: raw.slice(0, idx).trim(),
        artist: raw.slice(idx + sep.length).trim(),
      }
    }
  }
  return { title: raw, artist: 'Unknown Artist' }
}

export async function fetchTrackMeta(videoId: string): Promise<{
  title: string
  artist: string
  thumbnail: string
}> {
  try {
    const res = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`,
    )
    if (!res.ok) throw new Error('noembed failed')
    const data = await res.json()
    const rawTitle = data.title ?? 'Unknown Track'
    const parsed = parseTrackTitle(rawTitle)
    return {
      title: parsed.title,
      artist: data.author_name ?? parsed.artist,
      thumbnail: data.thumbnail_url ?? `https://i.ytimg.com/vi/${videoId}/default.jpg`,
    }
  } catch {
    return {
      title: 'Unknown Track',
      artist: 'Unknown Artist',
      thumbnail: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
    }
  }
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
