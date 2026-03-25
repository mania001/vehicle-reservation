'use client'

import { Separator } from '@/components/ui/separator'
import { Reservation } from '@/domains/reservation/reservation.types'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Car } from 'lucide-react'
import CarProgressBar from './car-progress-bar'

interface Props {
  reservation: Reservation
  sticky: React.ReactElement
  type: 'before' | 'usage'
}

export function ReservationUsage({ reservation, sticky, type = 'before' }: Props) {
  const vehicle = reservation.vehicle
  return (
    <>
      <div className="flex flex-col items-center justify-center text-center space-y-3 my-10">
        <div className="w-24 h-24 bg-primary/30 rounded-full flex items-center justify-center mb-6">
          <Car size={48} className="text-primary/60" />
        </div>
        <h3 className="text-2xl font-bold mt-2 mb-1">{vehicle?.name}</h3>
        <div className="flex justify-center items-center text-center h-3 gap-4 mt-2 text-md text-gray-400">
          <div>{vehicle?.plateNumber}</div>
          <Separator orientation="vertical" />
          <div>{'휘발유'}</div>
        </div>
      </div>
      <div className="mb-10">
        {type === 'before' && (
          <>
            <div className="flex justify-between text-sm mb-1">
              <span>
                {format(reservation.startAt, 'yyyy.MM.dd HH:mm', {
                  locale: ko,
                })}{' '}
                부터
              </span>
              <span>
                {format(reservation.endAt, 'yyyy.MM.dd HH:mm', {
                  locale: ko,
                })}{' '}
                까지
              </span>
            </div>
            <div className="w-full h-2 bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-full" />
            </div>
          </>
        )}
        {type === 'usage' && (
          <CarProgressBar startTime={reservation.startAt} endTime={reservation.endAt} />
        )}
      </div>
      <div className="w-full bg-white p-4 rounded-xl shadow-sm border space-y-4">
        {type === 'before' && (
          <>
            <p className="text-xs text-left text-gray-400 mb-1">주차 위치</p>
            <p className="text-left font-mono font-bold">{'지하 3층 F - 1'}</p>
          </>
        )}
        {type === 'usage' && (
          <>
            <p className="text-xs text-left text-gray-400 mb-1">반납 장소</p>
            <p className="text-left font-mono font-bold">
              {'신길본당'} (반납시간 :
              {format(reservation.endAt, 'yyyy.MM.dd HH:mm', {
                locale: ko,
              })}
              )
            </p>
          </>
        )}

        <Separator />

        <p className="text-xs text-left text-gray-400 mb-1">운전 안내</p>
        <div className="text-left font-mono font-bold my-2">
          <ul className="text-md space-y-1.5">
            <li>출발 전, 후 차량 상태를 반드시 입력해주세요</li>
            <li>주유 영수증이나 키는 관리자에게 제출해주세요</li>
            <li>쓰레기는 비치된 쓰레기 봉투에 담아주세요</li>
            <li>항상 안전운행에 힘써주세요</li>
            <li>운전 중 발생한 과태료는 운전자가 부담합니다</li>
          </ul>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md flex space-x-3 justify-center z-50">
        <div className="w-full max-w-md max-auto flex">{sticky && sticky}</div>
      </div>
    </>
  )
}
