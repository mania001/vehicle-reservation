'usc client'
import React, { useState, useEffect } from 'react'
import { differenceInMinutes, intervalToDuration, isAfter, isBefore } from 'date-fns'

interface CarProgressBarProps {
  startTime: Date // 대여 시작 시간
  endTime: Date // 반납 예정 시간
}

const CarProgressBar = ({ startTime, endTime }: CarProgressBarProps) => {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date()

      // 1. 전체 대여 시간(분)과 경과 시간(분) 계산
      const totalMinutes = differenceInMinutes(endTime, startTime)
      const elapsedMinutes = differenceInMinutes(now, startTime)

      // 2. 진행률 계산
      const rawProgress = totalMinutes > 0 ? (elapsedMinutes / totalMinutes) * 100 : 0

      /**
       * 오류 해결 포인트: clamp 사용법
       * date-fns의 clamp는 clamp(value, { start, end }) 형태입니다.
       * 하지만 단순 수치(0~100)를 제한할 때는 Math.max/min이 더 직관적이고 오류가 없습니다.
       */
      const currentProgress = Math.min(Math.max(rawProgress, 0), 100)

      // 3. 상태 업데이트 (숫자 타입 보장)
      setProgress(Number(currentProgress))

      // 3. 남은 시간 텍스트 생성
      if (isAfter(now, endTime)) {
        setTimeLeft('이용 종료')
      } else if (isBefore(now, startTime)) {
        setTimeLeft('이용 전')
      } else {
        // 1. 현재부터 종료까지의 기간(Duration) 추출
        const duration = intervalToDuration({ start: now, end: endTime })

        // 2. 각 단위 추출 (값이 없을 경우 0 처리)
        const d = duration.days || 0
        const h = duration.hours || 0
        const m = duration.minutes || 0

        // 3. 텍스트 조합
        let timeText = ''

        if (d > 0) {
          // 24시간 이상 남았을 때 (예: 1일 5시간 30분 남음)
          timeText = `${d}일 ${h > 0 ? `${h}시간 ` : ''}${m}분 남음`
        } else {
          // 24시간 미만일 때 (예: 5시간 30분 남음)
          timeText = `${h > 0 ? `${h}시간 ` : ''}${m}분 남음`
        }

        setTimeLeft(timeText)
      }
    }

    // 초기 실행 및 1분마다 업데이트
    updateProgress()
    const timer = setInterval(updateProgress, 60000)

    return () => clearInterval(timer)
  }, [startTime, endTime])

  return (
    <div className="w-full space-y-1.5">
      {/* 라벨 영역 */}
      <div className="flex justify-between text-sm mb-1">
        <span>이용 가능 시간</span>
        <span className={`${progress > 90 && 'text-red-500'}`}>{timeLeft}</span>
      </div>

      {/* 프로그레스 바 트랙 */}
      <div className="w-full h-2 bg-primary/20 rounded-full overflow-hidden">
        {/* 실제 진행 바 */}
        <div
          className={`h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(59,130,246,0.5)] ${
            progress > 99 ? 'bg-red-500' : 'bg-primary'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 보조 정보 (선택 사항) */}
      <div className="flex justify-between text-xs text-gray-400 font-medium">
        <span>{progress.toFixed(0)}% 사용됨</span>
        {progress > 90 && progress < 100 && <span>곧 반납 시간입니다!</span>}
        {progress === 100 && <span>반납 시간이 지났어요!!!!</span>}
      </div>
    </div>
  )
}

export default CarProgressBar
