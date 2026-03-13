'use server'

import { createClient } from '@/lib/supabase/client'
import { SetPasswordFormValues, setPasswordSchema } from '../schema/set-password-schema'

export async function setPassword(values: SetPasswordFormValues) {
  const { password } = setPasswordSchema.parse(values)

  const supabase = createClient()

  const { data, error } = await supabase.auth.updateUser({
    password,
  })

  if (error) throw new Error(error.message)

  return data
}
