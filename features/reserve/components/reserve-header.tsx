import Image from 'next/image'

export const ReserveHeader = () => (
  <header className="pt-10 pb-8 flex flex-col items-center gap-8">
    <Image src={'/images/logo.png'} alt="logo" width={140} height={39} priority />
    <div className="text-left w-full">
      <h1 className="text-2xl font-bold tracking-tight text-slate-800 ">차량 예약하기</h1>
      <p className="text-sm text-slate-500 font-medium mt-2">차량 예약 신청 할 수 있습니다.</p>
    </div>
  </header>
)
