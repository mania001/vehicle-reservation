'use client'

import { useRef } from 'react'
import { Camera, ImagePlus } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useImageUpload } from './use-image-upload'
import { ImagePreviewList } from './image-preview-list'

type Props = {
  max?: number
  label?: string

  capture?: boolean
  disabled?: boolean

  value?: File[]
  onChange?: (files: File[]) => void
}

export function ImageUpload({
  max = 8,
  label = '사진',
  capture = true,
  disabled,

  value,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    // files,
    previews,

    addFiles,
    removeFile,

    count,
  } = useImageUpload({ max, value, onChange })

  /**
   * 외부 form으로 전달
   */
  // const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files) return

  //   await addFiles(e.target.files)

  //   onChange?.(files)

  //   e.target.value = ''
  // }

  // const handleRemove = (index: number) => {
  //   removeFile(index)

  //   onChange?.(files)
  // }

  return (
    <div className="space-y-3">
      <Label className="flex items-center justify-between text-base">
        <span className="flex items-center gap-2">
          <Camera size={18} />
          {label}
        </span>

        <span className="text-sm font-medium text-primary">
          {count} / {max}
        </span>
      </Label>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="
            shrink-0
            w-24 h-24
            bg-gray-50
            rounded-2xl
            border-2
            border-dashed
            border-gray-200
            flex
            flex-col
            items-center
            justify-center
            text-gray-400
            active:bg-gray-100
            transition-colors
            disabled:opacity-40
          "
        >
          <ImagePlus size={28} />

          <span className="text-xs mt-2 font-bold">사진 추가</span>
        </button>

        <ImagePreviewList previews={previews} onRemove={removeFile} />
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        capture={capture ? 'environment' : undefined}
        hidden
        onChange={e => e.target.files && addFiles(e.target.files)}
      />
    </div>
  )
}
