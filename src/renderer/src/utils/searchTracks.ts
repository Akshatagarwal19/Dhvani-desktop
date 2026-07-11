import type { Track } from '../types/Track'
import { normalizeText } from './normalizeText'

export function searchTracks(
  tracks: Track[],
  searchQuery: string
): Track[] {
  const query = normalizeText(searchQuery)

  if (!query) {
    return tracks
  }

  return tracks.filter((track) => {
    const title = normalizeText(track.title)
    const artist = normalizeText(track.artist)
    const album = normalizeText(track.album)
    const filename = normalizeText(track.name)

    return (
      title.includes(query) ||
      artist.includes(query) ||
      album.includes(query) ||
      filename.includes(query)
    )
  })
}