create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_record record;
begin

select *
into invite_record
from public.pending_admin_invites
where email = new.email
limit 1;

insert into public.admin_profiles (
  id,
  name,
  role,
  is_active
)
values (
  new.id,
  coalesce(invite_record.name, 'Admin'),
  coalesce(invite_record.role, 'vehicle_manager'),
  false
);

delete from pending_admin_invites
where email = new.email;

return new;

end;
$$;