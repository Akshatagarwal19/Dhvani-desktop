import type { Track } from '../types/Track'
import type { FilterOption } from '../types/FilterOption'

export function filterTracks(
  tracks: Track[],
  filter: FilterOption,
  duplicates: Track[][]
): Track[] {
  switch (filter) {
    case 'missing-title':
      return tracks.filter(
        (track) => !track.title || track.title.trim() === ''
      )

    case 'missing-artist':
      return tracks.filter(
        (track) => !track.artist || track.artist.trim() === ''
      )

    case 'missing-album':
      return tracks.filter(
        (track) => !track.album || track.album.trim() === ''
      )

    case 'duplicates': {
      const duplicatePaths = new Set(
        duplicates.flat().map((track) => track.path)
      )

      return tracks.filter((track) =>
        duplicatePaths.has(track.path)
      )
    }

    case 'all':
    default:
      return tracks
  }
}