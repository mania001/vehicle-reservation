import { z } from 'zod'

const PHONE_REGEX = /^01[016789]\d{7,8}$/

export const reservationCoreSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해주세요'),
    organization: z.string().min(1, '조직을 입력해주세요'),
    phone: z.string().regex(PHONE_REGEX, '휴대폰 번호 형식이 올바르지 않습니다'),

    startAt: z.date({
      message: '시작 시간을 선택해주세요',
    }),
    endAt: z.date({
      message: '종료 시간을 선택해주세요',
    }),

    purpose: z.string().min(1, '사용목적을 입력해주세요'),
    destination: z.string().min(1, '목적지를 입력해주세요'),
  })
  .refine(data => data.endAt > data.startAt, {
    message: '종료 시간은 시작 시간 이후여야 합니다',
    path: ['endAt'],
  })
