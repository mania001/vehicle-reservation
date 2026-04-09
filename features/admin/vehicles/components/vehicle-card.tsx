'use client'

import { Car, Fuel } from 'lucide-react'
import { VehicleListItem } from '../types/vehicle-list-item'
import { FUEL_TYPE_MAP } from '@/domains/vehicle/vehicle-status'
import { VehicleStatusBadge } from './vehicle-status-badge'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { VehicleDrawer } from './vehicle-drawer'
//import { useRouter } from 'next/navigation'
import { useUpdateVehicle } from '../mutations/use-update-vehicle'

type Props = {
  vehicle: VehicleListItem
}

export function VehicleCard({ vehicle }: Props) {
  //const router = useRouter()
  const [open, setOpen] = useState(false)

  const mutation = useUpdateVehicle()

  return (
    <>
      <div
        onClick={e => {
          e.stopPropagation()
          //router.push(`/admin/vehicles/${vehicle.id}`)
        }}
        className="block relative w-full rounded-xl border p-3 text-left transition border-border bg-white"
      >
        <div className="flex gap-4 items-center">
          <div className="relative w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm text-slate-300">
            <Car className="w-12 h-12" />
          </div>

          <div className="flex-1">
            <p className="font-semibold">
              {vehicle.name} ({vehicle.plateNumber})
            </p>
            <div className="flex gap-3 mt-1">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <Fuel size={10} /> {vehicle.fuelLevel}
              </span>
              <span className="text-[10px] font-bold text-blue-500 uppercase">
                {vehicle?.fuelType ? FUEL_TYPE_MAP[vehicle.fuelType] : '-'}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              주차위치:{' '}
              {vehicle?.lastParkingZone
                ? `${vehicle.lastParkingZone} ${vehicle.lastParkingNumber || ''}`
                : '기록 없음'}
            </p>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={e => {
                e.stopPropagation()
                e.currentTarget.blur()
                setOpen(true)
              }}
            >
              수정
            </Button>
          </div>
        </div>
        <VehicleStatusBadge status={vehicle.status} />
      </div>
      <VehicleDrawer
        open={open}
        onOpenChange={setOpen}
        defaultValue={vehicle}
        onSubmit={async data => {
          mutation.mutateAsync({
            id: vehicle.id,
            data,
          })
        }}
      />
    </>
  )
}
