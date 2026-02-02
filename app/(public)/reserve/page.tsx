import ReserveForm from '@/features/reserve/components/reserve-form'
import { ReserveHeader } from '@/features/reserve/components/reserve-header'

export default function ReservePage() {
  return (
    <>
      {/* 상단 로고 및 헤더 섹션 */}
      <ReserveHeader />

      {/* 2. 입력 폼 섹션  */}
      <main className="flex-1 overflow-y-auto">
        <ReserveForm />
      </main>
    </>
  )
}
