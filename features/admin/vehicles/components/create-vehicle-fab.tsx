'use client'

import { Plus } from 'lucide-react'

import { useState } from 'react'
import { VehicleDrawer } from './vehicle-drawer'
import { useCreateVehicle } from '../mutations/use-create-vehicle'

export function CreateVehicleFab() {
  const [open, setOpen] = useState(false)

  const mutation = useCreateVehicle()

  return (
    <>
      <button
        onClick={e => {
          setOpen(true)
          e.currentTarget.blur() // 클릭 직후 포커스 해제
        }}
        className="
          fixed
          bottom-24
          right-6
          rounded-full
          w-14
          h-14
          bg-primary
          text-white
          shadow-lg
          flex
          items-center
          justify-center
          cursor-pointer
        "
      >
        <Plus />
      </button>

      <VehicleDrawer open={open} onOpenChange={setOpen} onSubmit={mutation.mutateAsync} />
    </>
  )
}
