import z, { email } from 'zod'

export const loginSchema = z.object({
  email: email('이메일 형식이 올바르지 않습니다.').min(1, '이메일을 입력해주세요.'),
  password: z.string().min(8, '비밀번호가 너무 짧습니다.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
