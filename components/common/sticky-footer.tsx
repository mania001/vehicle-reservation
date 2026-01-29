import { Button } from '../ui/button'

interface StickyFooterProps {
  label: string
  onClick?: () => void
  disabled?: boolean
}

export const StickyFooter = ({ label, onClick, disabled }: StickyFooterProps) => (
  <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-center z-50">
    <div className="max-w-md w-full">
      <Button
        onClick={onClick}
        disabled={disabled}
        className="w-full h-14 bg-primary hover:bg-primary-hover text-white rounded-2xl text-lg font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {label}
      </Button>
    </div>
  </div>
)
