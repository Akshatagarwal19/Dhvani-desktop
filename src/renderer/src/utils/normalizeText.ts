export function normalizeText(text: string | undefined): string {
  if (!text) return ''

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
}