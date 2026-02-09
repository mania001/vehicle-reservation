import { differenceInMinutes, format, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

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

/**
 * 상대 시간 표시 (예: 방금 전, 3분 전)
 */
export const getTimeAgo = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ko,
  })
}

/**
 * 이용 시간 계산 (예: 3시간, 3시간 30분)
 */
export const getDurationText = (startAt: string | Date, endAt: string | Date) => {
  const start = new Date(startAt)
  const end = new Date(endAt)

  const totalMinutes = differenceInMinutes(end, start)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0 && minutes > 0) {
    return `${hours}시간 ${minutes}분`
  } else if (hours > 0) {
    return `${hours}시간`
  } else {
    return `${minutes}분`
  }
}

/**
 * 예약 기간 및 소요 시간 포맷팅
 * @returns { range: "2026. 2. 9. 오후 1:37 ~ 오후 4:37", duration: 3 }
 */
export const getReservationPeriod = (startAt: string | Date, endAt: string | Date) => {
  const start = new Date(startAt)
  const end = new Date(endAt)

  const range = `${format(start, 'yyyy. M. d. a h:mm', { locale: ko })} ~ ${format(end, 'yyyy. M. d. a h:mm', { locale: ko })}`
  const duration = getDurationText(start, end)

  return { range, duration }
}
