import type { Track } from '../types/Track'
import { compareDuration } from './compareDuration'
import { compareTextSimilarity } from './compareTextSimilarity'
import { normalizeFilename } from './normalizeFilename'

const TITLE_SCORE = 40
const ARTIST_SCORE = 30
const DURATION_SCORE = 20
const FILENAME_SCORE = 10

const TITLE_SIMILARITY = 85
const ARTIST_SIMILARITY = 90
const FILENAME_SIMILARITY = 90

const DUPLICATE_THRESHOLD = 30
// Threshold intentionally set to 30 because many MP3 files
// lack embedded title/artist metadata. Revisit scoring model
// in Version 3 if needed.

export type TrackComparison = {
  score: number
  reasons: string[]
  isDuplicate: boolean
}

export function compareTracks(trackA: Track, trackB: Track): TrackComparison {
  let score = 0

  const reasons: string[] = []

  if (compareDuration(trackA.duration, trackB.duration)) {
    score += DURATION_SCORE
    reasons.push('Same duration')
  }

  const artistSimilarity = compareTextSimilarity(trackA.artist, trackB.artist)

  if (artistSimilarity >= ARTIST_SIMILARITY) {
    score += ARTIST_SCORE

    reasons.push(`Artist ${Math.round(artistSimilarity)}% similar`)
  }

  const titleSimilarity = compareTextSimilarity(trackA.title, trackB.title)

  if (titleSimilarity >= TITLE_SIMILARITY) {
    score += TITLE_SCORE

    reasons.push(`Title ${Math.round(titleSimilarity)}% similar`)
  }


  const filenameSimilarity = compareTextSimilarity(
    normalizeFilename(trackA.name),
    normalizeFilename(trackB.name)
  )

  if (filenameSimilarity >= FILENAME_SIMILARITY) {
    score += FILENAME_SCORE

    reasons.push(`Filename ${Math.round(filenameSimilarity)}% similar`)
  }
  return {
    score,
    reasons,
    isDuplicate: score >= DUPLICATE_THRESHOLD
  }
}
