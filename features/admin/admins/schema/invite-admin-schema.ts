import z, { email } from 'zod'

export const inviteAdminSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: email('이메일 형식이 올바르지 않습니다.').min(1, '이메일을 입력해주세요.'),
  role: z.enum(['super_admin', 'reservation_manager', 'vehicle_manager'], {
    message: '올바른 역할을 선택해주세요.',
  }),
})

export type InviteAdminFormValues = z.infer<typeof inviteAdminSchema>
