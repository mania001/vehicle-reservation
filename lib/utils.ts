import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* 숫자로만 구성된 전화번호를 하이픈(-)이 포함된 형식으로 변환합니다.
 * @param phone - "01012341234" 또는 "0101231234"
 * @returns "010-1234-1234" 또는 "010-123-1234"
 */
export const formatPhoneNumber = (phone: string | undefined | null) => {
  if (!phone) return ''

  // 숫자만 남기기
  const cleaned = phone.replace(/\D/g, '')

  // 11자리 (010-1234-1234)
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }

  // 10자리 (010-123-4567)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  // 그 외에는 입력값 그대로 반환
  return phone
}

/**
 * 텍스트를 클립보드에 복사합니다.
 */
export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('복사 실패:', err)
    return false
  }
}
