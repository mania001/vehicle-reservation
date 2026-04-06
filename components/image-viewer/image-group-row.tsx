'use client'

import Image from 'next/image'

type Props = {
  label: string
  images: string[]

  onOpen: (index: number) => void
}

export function ImageGroupRow({ label, images, onOpen }: Props) {
  if (!images?.length) {
    return <div className="flex-1  text-sm font-medium text-left">{label} (0)</div>
  }

  const preview = images.slice(0, 3)

  return (
    <button className="relative flex-1 overflow-auto text-left" onClick={() => onOpen(0)}>
      <div className="text-sm font-medium">
        {label} ({images.length})
      </div>

      {/* <button key={src} type="button" onClick={() => onOpen(i)} className="relative"> */}

      <div className="relative w-fit">
        <div className="relative flex -space-x-4 mt-1">
          {preview.map((src, i) => (
            <div
              key={i}
              className="relative w-12 h-12 rounded-md overflow-hidden border border-white shadow"
            >
              <Image src={src} alt="" fill sizes="48px" className="object-cover" />
            </div>
          ))}
        </div>

        {/* 남은 개수 */}
        {images.length > 3 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
            +{images.length - 3}
          </div>
        )}
      </div>
    </button>
  )
}
