import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

// 선택지 컴포넌트 (네 / 아니요)
export const CheckQuestion = ({
  question,
  value,
  onSelect,
  exceptedNo = false,
}: {
  question: React.ReactNode
  value: boolean | null
  onSelect: (val: boolean) => void
  exceptedNo?: boolean
}) => (
  <section>
    <p className="text-[17px] leading-snug mb-2 text-slate-800">{question}</p>
    <div className="flex items-center justify-end gap-6 h-10">
      <button
        onClick={() => (exceptedNo ? onSelect(!value) : onSelect(true))}
        className={cn(
          'flex items-center gap-1 text-[17px] transition-colors',
          value === true ? 'text-primary font-bold' : 'text-slate-300',
        )}
      >
        <Check
          className={cn('w-5 h-5', value === true ? 'text-primary' : 'text-slate-300')}
          strokeWidth={3}
        />
        네
      </button>
      {!exceptedNo && (
        <button
          onClick={() => onSelect(false)}
          className={cn(
            'flex items-center gap-1 text-[17px] transition-colors',
            value === false ? 'text-primary font-bold' : 'text-slate-300',
          )}
        >
          <Check
            className={cn('w-5 h-5', value === false ? 'text-primary' : 'text-slate-300 ')}
            strokeWidth={3}
          />
          아니요
        </button>
      )}
    </div>
  </section>
)
