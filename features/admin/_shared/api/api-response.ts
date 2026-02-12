export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'

export type ApiResponse<T> =
  | {
      success: true
      data?: T
    }
  | {
      success: false
      error: {
        code: ApiErrorCode
        message: string
        details?: unknown
      }
    }

export function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data }
}

export function fail(code: ApiErrorCode, message: string, details?: unknown): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  }
}
