/**
 * Converts a local Date (KST) to UTC Date for DB storage
 */
export function toUTC(date: Date): Date {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
}

/**
 * Converts a UTC Date from DB to local Date (KST) for display
 */
export function fromUTC(date: Date): Date {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000)
}
