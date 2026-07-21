import { normalizeText } from './normalizeText'

export function normalizeFilename(filename: string): string {
  return normalizeText(
    filename
      // Remove file extension
      .replace(/\.[^/.]+$/, '')

      // Remove leading track numbers
      .replace(/^\d+\s*[-._]?\s*/, '')

      // Remove Windows copy suffixes
      .replace(/\s*-\s*copy(\s*\(\d+\))?/gi, '')

      // Remove standalone "(1)", "(2)" etc.
      .replace(/\(\d+\)/g, '')

      // Replace underscores with spaces
      .replace(/_/g, ' ')

      // Replace hyphens with spaces
      .replace(/-/g, ' ')
  )
}
