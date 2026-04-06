'use client'

import Image from 'next/image'
import { X } from 'lucide-react'

type Props = {
  previews: string[]
  onRemove?: (index: number) => void
}

export function ImagePreviewList({ previews, onRemove }: Props) {
  return (
    <div
      className="
        flex-1
        flex
        gap-3
        overflow-x-auto
        pb-2
        snap-x
        scrollbar-hide
      "
    >
      {previews.map((src, index) => (
        <div
          key={src}
          className="
            relative
            shrink-0
            w-24 h-24
            rounded-2xl
            overflow-hidden
            bg-gray-100
            snap-start
            shadow-sm
          "
        >
          <Image src={src} alt={`preview-${index}`} fill className="object-cover" unoptimized />

          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="
                absolute
                top-1 right-1
                bg-black/60
                p-1
                rounded-full
                text-white
                z-10
              "
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}

      {previews.length === 0 && (
        <div className="flex items-center text-gray-300 text-xs font-medium">
          사진을 추가해주세요
        </div>
      )}
    </div>
  )
}
