import z from 'zod'

export const setPasswordSchema = z
  .object({
    password: z.string().min(8, '비밀번호가 너무 짧습니다.'),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'], // 에러 메시지를 passwordConfirm 필드에 표시
  })

export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>
