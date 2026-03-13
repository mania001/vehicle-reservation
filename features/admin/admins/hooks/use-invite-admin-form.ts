import { useForm } from 'react-hook-form'
import { InviteAdminFormValues, inviteAdminSchema } from '../schema/invite-admin-schema'
import { zodResolver } from '@hookform/resolvers/zod'

export function useInviteAdminForm() {
  return useForm<InviteAdminFormValues>({
    resolver: zodResolver(inviteAdminSchema),
  })
}
