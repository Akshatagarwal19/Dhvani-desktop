export function compareDuration(
  duration1: number | undefined,
  duration2: number | undefined,
  tolerance = 2
): boolean {
  if (duration1 === undefined || duration2 === undefined) {
    return false
  }

  return Math.abs(duration1 - duration2) <= tolerance
}