import { VEHICLE_STATUS_MAP, VehicleStatus } from '@/domains/vehicle/vehicle-status'

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  const map = {
    available: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-600',
    maintenance: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <span
      className={`
        absolute top-2 left-3
        text-xs
        px-2
        py-1
        rounded-full
        font-semibold
        ${map[status]}
      `}
    >
      {VEHICLE_STATUS_MAP[status]}
    </span>
  )
}
