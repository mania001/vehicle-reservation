import InviteAdminForm from '@/features/admin/admins/components/invite-admin-form'

export default function AdminsInvitePage() {
  return (
    <div className="relative p-4 space-y-3">
      <div>
        <h3 className="text-lg font-bold pb-10">관리자 초대하기</h3>
        <InviteAdminForm />
      </div>
    </div>
  )
}
