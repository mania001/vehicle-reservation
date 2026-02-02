import { TIMELINE_STEPS } from '../timeline/timeline.steps'
import { TimelineStatus } from '../timeline/timeline.types'
import { cn } from '@/lib/utils'

interface Props {
  currentStatus: TimelineStatus
}

export function ReservationTimeline({ currentStatus }: Props) {
  const currentIndex = TIMELINE_STEPS.findIndex(step => step.key === currentStatus)

  return (
    <ol className="flex items-center justify-between">
      {TIMELINE_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex

        return (
          <li key={step.key} className="flex flex-col items-center flex-1">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                isCompleted ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500',
              )}
            >
              {index + 1}
            </div>

            <span
              className={cn(
                'mt-2 text-xs font-medium',
                isCompleted ? 'text-slate-900' : 'text-slate-400',
              )}
            >
              {step.label}
            </span>

            {index < TIMELINE_STEPS.length && (
              <div
                className={cn('h-0.5 w-full mt-4', isCompleted ? 'bg-primary' : 'bg-slate-200')}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
