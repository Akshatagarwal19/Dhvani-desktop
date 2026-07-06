import { normalizeText } from './normalizeText'

export function compareTextSimilarity(
  textA: string | undefined,
  textB: string | undefined
): number {

  const a = normalizeText(textA)
  const b = normalizeText(textB)

  if (!a || !b) {
    return 0
  }

  if (a === b) {
    return 100
  }

  const wordsA = new Set(a.split(' '))
  const wordsB = new Set(b.split(' '))

  let common = 0

  wordsA.forEach(word => {
    if (wordsB.has(word)) {
      common++
    }
  })

  const maxWords = Math.max(wordsA.size, wordsB.size)

  return (common / maxWords) * 100
}