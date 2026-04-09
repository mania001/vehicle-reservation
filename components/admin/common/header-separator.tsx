import { cn } from '@/lib/utils'

interface Props {
  tab?: boolean
}

export const HeaderSeparator = ({ tab = false }: Props) => (
  <div
    className={cn(
      'fixed max-w-md w-full z-50 border-b border-slate-50 shadow-xs backdrop-blur-xl',
      tab ? 'top-29' : 'top-14',
    )}
  />
)
