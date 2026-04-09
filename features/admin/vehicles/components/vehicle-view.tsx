import { MainSection } from '@/components/admin/common/main-section'
import { useVehicleList } from '../hooks/use-vehicle-list'
import VehicleList from './vehicle-list'

export function VehicleView() {
  const { data, isLoading, isError } = useVehicleList()
  if (isLoading)
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    )

  if (isError)
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-semibold text-rose-600">데이터를 불러오지 못했습니다.</p>
      </div>
    )

  return (
    <div className="flex flex-col h-full">
      <MainSection tab={false}>
        <VehicleList items={data?.items ?? []} emptyMessage="등록된 차량이 없습니다." />
      </MainSection>
    </div>
  )
}
