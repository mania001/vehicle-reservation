import { LucideIcon } from 'lucide-react'

interface Props {
  icon?: LucideIcon
  title: React.ReactNode
  description?: React.ReactNode
  extra?: React.ReactNode
  tone?: 'info' | 'error' | 'warning'
}

export function ReservationInformation({
  icon: Icon,
  title,
  description,
  extra,
  tone = 'info',
}: Props) {
  const toneBackground = {
    info: 'bg-primary/30',
    error: 'bg-rose-100',
    warning: 'bg-yellow-100',
  }

  const toneIcon = {
    info: 'text-primary/60',
    error: 'text-rose-500',
    warning: 'text-yellow-600',
  }

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-3 my-20">
      {Icon && (
        <div
          className={`w-48 h-48 bg-primary/30 rounded-full flex items-center justify-center mb-6 ${toneBackground[tone]}`}
        >
          <Icon size={100} className={`${toneIcon[tone]}`} />
        </div>
      )}
      <h3 className="text-4xl font-bold mt-8 mb-4">{title}</h3>
      <p className="text-md text-gray-600">{description}</p>
      {extra && extra}
    </div>
  )
}
