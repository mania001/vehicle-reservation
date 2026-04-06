'use client'

import { useState } from 'react'
import { ImageGroup } from './types'
import { ImageGroupRow } from './image-group-row'
import { ImageViewerLightbox } from './image-viewer-lightbox'

type Props = {
  groups: ImageGroup[]
  title?: string
  direction?: 'row' | 'column'
}

export function ImageSection({ groups, title, direction = 'row' }: Props) {
  const [open, setOpen] = useState(false)
  const [slides, setSlides] = useState<{ src: string }[]>([])
  const [index, setIndex] = useState(0)

  function openViewer(images: string[], startIndex: number) {
    setSlides(images.map(src => ({ src })))

    setIndex(startIndex)

    setOpen(true)
  }

  return (
    <div className="space-y-3">
      {title && <h3 className="font-semibold">{title}</h3>}
      <div className={`flex ${direction === 'row' ? 'flex-row' : 'flex-col'} justify-start gap-3 `}>
        {groups.map(group => (
          <ImageGroupRow
            key={group.key}
            label={group.label}
            images={group.images}
            onOpen={i => openViewer(group.images, i)}
          />
        ))}
      </div>

      <ImageViewerLightbox
        open={open}
        onClose={() => setOpen(false)}
        slides={slides}
        index={index}
        setIndex={setIndex}
      />
    </div>
  )
}
