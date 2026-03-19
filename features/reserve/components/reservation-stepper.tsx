import { cn } from '@/lib/utils'
import { RESERVATION_STEPS } from '../progress'

interface Props {
  currentStep: number
}

export function ReservationStepper({ currentStep }: Props) {
  return (
    <ol className="flex items-center justify-between">
      {RESERVATION_STEPS.map((step, index) => {
        const completed = index <= currentStep
        // const current = index === currentStep

        return (
          <li key={index} className="flex flex-col items-center flex-1">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                completed ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500',
              )}
            >
              {index + 1}
            </div>

            <span
              className={cn(
                'mt-2 text-xs font-medium',
                completed ? 'text-slate-900' : 'text-slate-400',
              )}
            >
              {step.label}
            </span>

            {index < RESERVATION_STEPS.length && (
              <div className={cn('h-0.5 w-full mt-4', completed ? 'bg-primary' : 'bg-slate-200')} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
