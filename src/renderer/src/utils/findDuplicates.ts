import type { Track } from '../types/Track'
import { compareTracks } from './compareTracks'

export function findDuplicates(tracks: Track[]): Track[][] {
  const duplicateGroups: Track[][] = []
  const visited = new Set<string>()

  for (let i = 0; i < tracks.length; i++) {
    if (visited.has(tracks[i].path)) continue

    const group: Track[] = [tracks[i]]

    for (let j = i + 1; j < tracks.length; j++) {
      const result = compareTracks(tracks[i], tracks[j])

      if (result.isDuplicate) {
        group.push(tracks[j])
        visited.add(tracks[j].path)

        console.log('Duplicate Match')
        console.log('Duplicate Match')
        console.log(tracks[i].name)
        console.log(tracks[j].name)
        console.log(result)
      }
    }

    if (group.length > 1) {
      duplicateGroups.push(group)
      visited.add(tracks[i].path)
    }
  }

  return duplicateGroups
}