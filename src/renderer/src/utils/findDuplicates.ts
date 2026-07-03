import type { Track } from '../types/Track'

export function findDuplicates(tracks: Track[]): Track[][] {
  const duplicateMap = new Map<string, Track[]>()

  tracks.forEach((track) => {
    const key = `${(track.title ?? '').toLowerCase().trim()}|${(track.artist ?? '').toLowerCase().trim()}|${Math.round(track.duration ?? 0)}`

    if (!duplicateMap.has(key)) {
      duplicateMap.set(key, [])
    }

    duplicateMap.get(key)!.push(track)
  })

  return Array.from(duplicateMap.values()).filter(
    (group) => group.length > 1
  )
}