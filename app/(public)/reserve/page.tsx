import { StickyFooter } from '@/components/common/sticky-footer'
import ReserveForm from '@/features/reserve/components/reserve-form'
import { ReserveHeader } from '@/features/reserve/components/reserve-header'

export default function ReservePage() {
  return (
    <>
      {/* 상단 로고 및 헤더 섹션 */}
      <ReserveHeader />

      {/* 2. 입력 폼 섹션 (버튼 제외 영역만 스크롤) */}
      <main className="flex-1 overflow-y-auto">
        <ReserveForm />
      </main>

      {/* 3. 하단 고정 버튼 섹션 */}
      <StickyFooter label="예약 신청하기" />
    </>
  )
}
