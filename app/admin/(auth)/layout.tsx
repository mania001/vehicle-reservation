import Image from 'next/image'

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center layout-gap">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium pb-4">
          <div className="flex gap-2 self-center justify-center items-center w-full">
            <Image src={'/images/logo.png'} alt="logo" width={140} height={39} priority />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
