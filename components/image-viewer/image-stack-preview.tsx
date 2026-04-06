'use client'

import Image from 'next/image'

interface Props {
  images: string[]
  onClick: () => void
}

export function ImageStackPreview({ images, onClick }: Props) {
  const visible = images.slice(0, 3)
  const remain = images.length - visible.length

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-100"
    >
      {/* 대표 이미지 */}
      <Image
        src={images[0]}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 400px"
        className="object-cover"
        priority
      />

      {/* 겹쳐진 썸네일 느낌 */}
      <div className="absolute bottom-2 left-2 flex -space-x-2">
        {visible.map((src, i) => (
          <div
            key={i}
            className="relative w-8 h-8 rounded-md overflow-hidden border border-white shadow"
          >
            <Image src={src} alt="" fill sizes="32px" className="object-cover" />
          </div>
        ))}
      </div>

      {/* 남은 개수 */}
      {remain > 0 && (
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          +{remain}
        </div>
      )}
    </button>
  )
}
