import type { Track } from '../types/Track'
import type { SortOption } from '../types/SortOption'

export function sortTracks(
  tracks: Track[],
  sortOption: SortOption
): Track[] {
  const sortedTracks = [...tracks]
  console.log('sortTracks called')
  console.log('Sort option:', sortOption)
  console.log('Tracks:', tracks.length)

  switch (sortOption) {
    case 'title':
      sortedTracks.sort((a, b) =>
        (a.title || a.name).localeCompare(b.title || b.name)
      )
      break

    case 'artist':
      console.log(
        sortedTracks.map(track => ({
          title: track.title || track.name,
          artist: track.artist
        }))
      )

      sortedTracks.sort((a, b) =>
        (a.artist || '').localeCompare(b.artist || '')
      )
      break

    case 'album':
      sortedTracks.sort((a, b) =>
        (a.album || '').localeCompare(b.album || '')
      )
      break

    case 'duration':
      sortedTracks.sort(
        (a, b) => (a.duration || 0) - (b.duration || 0)
      )
      break
  }

  return sortedTracks
}