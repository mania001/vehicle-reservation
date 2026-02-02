const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generatePublicCode(length = 10) {
  return Array.from({ length })
    .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
    .join('')
}
