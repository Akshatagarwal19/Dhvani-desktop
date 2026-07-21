export function formatBitrate(bitrate?: number) {
  if (!bitrate) return '-'

  return `${Math.round(bitrate / 1000)} kbps`
}