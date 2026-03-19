import { getReservationByPublicCode } from '@/domains/reservation/get-reservation-by-public-code'
import { ReservationSummary } from '@/features/reserve/components/reservation-summary'
import { notFound } from 'next/navigation'
import { getReservationStep } from '@/features/reserve/progress'
import { ReservationStepper } from '@/features/reserve/components/reservation-stepper'
import { Calendar, CheckCircle, Clock, NavigationOff } from 'lucide-react'
import { ReservationInformation } from '@/features/reserve/components/reservation-infomation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { ReservationUsage } from '@/features/reserve/components/reservation-usage'

interface PageProps {
  params: { publicCode: string }
}

export default async function ReserveDeatilPage({ params }: PageProps) {
  const { publicCode } = await params
  const reservation = await getReservationByPublicCode(publicCode)

  if (!reservation) {
    notFound()
  }

  const step = getReservationStep(reservation.status, reservation.usageStatus ?? undefined)

  const vehicle = reservation.vehicle

  return (
    <div className="space-y-6 pb-16">
      {/* Step UI */}
      <div className="mt-4">{step < 5 && <ReservationStepper currentStep={step} />}</div>

      <main className="flex-1 space-y-6 mt-10">
        {step === 0 && (
          <>
            <ReservationInformation
              icon={Clock}
              title={'예약접수'}
              description={
                <>
                  현재 승인 대기 중입니다.
                  <br />
                  잠시만 기다려주세요.
                </>
              }
            />
            <ReservationSummary reservation={reservation} />
          </>
        )}
        {step === 1 && (
          <>
            <ReservationInformation
              icon={CheckCircle}
              title={'예약 승인 완료!'}
              description={
                <>
                  예약이 승인되었습니다. <br />
                  사용 당일 안내에 따라 진행해주세요.
                </>
              }
              // extra={
              //   <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-orange-200 mt-2">
              //     <p className="text-xs text-left text-gray-400 mb-1">예약번호</p>
              //     <p className="text-left font-mono font-bold">{publicCode}</p>
              //   </div>
              // }
            />
            <div className="w-full bg-white p-4 rounded-xl shadow-sm border space-y-4">
              {/* <p className="text-xs text-left text-gray-400 mb-1">예약번호</p>
              <p className="text-left font-mono font-bold">{publicCode}</p> */}
              <p className="text-xs text-left text-gray-400 mb-1">예약기간</p>
              <p className="text-left font-mono font-bold">
                {format(reservation.startAt, 'yyyy.MM.dd HH:mm', {
                  locale: ko,
                })}{' '}
                ~ {format(reservation.endAt, 'MM.dd HH:mm', { locale: ko })}
              </p>
              {vehicle && (
                <>
                  <p className="text-xs text-left text-gray-400 mb-1">배정차량</p>
                  <p className="text-left font-mono font-bold">
                    {vehicle.name} ({vehicle.plateNumber})
                  </p>
                </>
              )}
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md flex space-x-3 justify-center z-50">
              <Button className="flex-1 h-12 shadow">운전자 등록</Button>
              <Button className="flex-1 h-12 bg-gray-200 text-gray-500 shadow">예약 취소</Button>
            </div>
          </>
        )}
        {step === 2 && (
          <ReservationUsage
            reservation={reservation}
            type="before"
            sticky={<Button className="flex-1 h-15 text-md shadow">차량 이용하기</Button>}
          />
        )}
        {step === 3 && (
          <ReservationUsage
            reservation={reservation}
            type="usage"
            sticky={<Button className="flex-1 h-15 text-md shadow">반납하기</Button>}
          />
        )}
        {step === 4 && (
          <>
            <ReservationInformation
              icon={CheckCircle}
              title={'이용 완료'}
              description={'이용해 주셔서 감사합니다!'}
            />
          </>
        )}
        {step === 5 && (
          <div className="pt-30">
            <ReservationInformation
              icon={NavigationOff}
              title={'예약 거절'}
              description={
                <>
                  예약이 승인되지 않았습니다. <br />
                  필요 시 관리자에게 문의해주세요.
                </>
              }
              tone={'error'}
            />
          </div>
        )}
        {step === 6 && (
          <div className="pt-30">
            <ReservationInformation
              icon={Calendar}
              title={'예약 취소'}
              description={<>해당 예약은 취소 처리되었습니다.</>}
              tone={'warning'}
            />
          </div>
        )}
      </main>
    </div>
  )
}
