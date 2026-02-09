import { cn } from '@/lib/utils'
import { HeaderSeparator } from './header-separator'

interface MainSectionProps {
  tab?: boolean
  children: React.ReactNode
}

export const MainSection = ({ tab = false, children }: MainSectionProps) => {
  return (
    <>
      <HeaderSeparator tab />
      <main className={cn('pb-8', tab ? 'pt-15' : 'p-4')}>{children}</main>
    </>
  )
}
