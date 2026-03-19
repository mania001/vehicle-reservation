import z from 'zod'

const PHONE_REGEX = /^01[016789]\d{7,8}$/
export const driverSchema = z.object({
  name: z.string().min(1, '운전자 이름을 입력해주세요'),
  phone: z.string().regex(PHONE_REGEX, '운전자 휴대폰 번호 형식이 올바르지 않습니다'),
})

export type DriverFormValues = z.infer<typeof driverSchema>
