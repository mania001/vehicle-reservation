'use client'

import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

type Props = {
  open: boolean
  onClose: () => void
  slides: { src: string }[]
  index: number
  setIndex: (index: number) => void
}

export function ImageViewerLightbox({ open, onClose, slides, index, setIndex }: Props) {
  if (!open) return null

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body {
              pointer-events: auto !important;
            }
            .yarl__container {
              z-index: 9999 !important;
            }
          `,
        }}
      />

      <div className="fixed inset-0 z-9999">
        <Lightbox
          open={open}
          close={onClose}
          index={index}
          plugins={[Zoom]}
          carousel={{ finite: true }}
          slides={slides}
          on={{
            view: ({ index }) => setIndex(index),
          }}
          portal={{ root: document.body }}
        />
      </div>
    </>
  )
}
