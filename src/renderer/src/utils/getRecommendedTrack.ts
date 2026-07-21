import type { Track } from '../types/Track'

export function getRecommendedTrack(group: Track[]): Track {
  return [...group].sort((a, b) => {
    if ((b.bitrate ?? 0) !== (a.bitrate ?? 0)) {
      return (b.bitrate ?? 0) - (a.bitrate ?? 0)
    }

    return (b.size ?? 0) - (a.size ?? 0)
  })[0]
}