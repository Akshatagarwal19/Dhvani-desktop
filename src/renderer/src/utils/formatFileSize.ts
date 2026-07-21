export function formatFileSize(size?: number) {
  if (!size) return '-'

  const mb = size / (1024 * 1024)

  return `${mb.toFixed(1)} MB`
}