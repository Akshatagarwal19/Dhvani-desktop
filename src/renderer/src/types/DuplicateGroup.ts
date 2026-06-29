import type { Track } from './Track'

export interface DuplicateGroup {
  reason: 'filename' | 'metadata' | 'metadata-duration'
  tracks: Track[]
}