import type { Track } from '../types/Track'

export type LibraryStats = {
  totalTracks: number
  totalArtists: number
  totalAlbums: number
  duplicateGroups: number
  missingArtist: number
  missingAlbum: number
  totalDuration: number
}
export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return `${hours}h ${minutes}m`
}

export function calculateLibraryStats(
  tracks: Track[],
  duplicates: Track[][]
): LibraryStats {

  const artists = new Set(
    tracks
      .map(track => track.artist)
      .filter(Boolean)
  )

  const albums = new Set(
    tracks
      .map(track => track.album)
      .filter(Boolean)
  )

  const totalDuration = tracks.reduce(
    (sum, track) => sum + (track.duration ?? 0),
    0
  )

  return {
    totalTracks: tracks.length,

    totalArtists: artists.size,

    totalAlbums: albums.size,

    duplicateGroups: duplicates.length,

    missingArtist: tracks.filter(
      track => !track.artist
    ).length,

    missingAlbum: tracks.filter(
      track => !track.album
    ).length,

    totalDuration
  }
}