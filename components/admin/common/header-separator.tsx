import { cn } from '@/lib/utils'

interface Props {
  tab?: boolean
}

export const HeaderSeparator = ({ tab = false }: Props) => (
  <div
    className={cn(
      'fixed top-29 max-w-md w-full z-100 border-b border-slate-100 shadow-xs backdrop-blur-xl',
      tab ? 'top-29' : 'top-15',
    )}
  />
)
