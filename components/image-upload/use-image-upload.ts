'use client'

import { useMemo, useEffect, useState } from 'react'
import { compressAndFormatImage } from '@/lib/image'

type Options = {
  max?: number
  value?: File[]
  onChange?: (files: File[]) => void
}

export function useImageUpload({ max = 8, value, onChange }: Options = {}) {
  const isControlled = value !== undefined && onChange

  const [internalFiles, setInternalFiles] = useState<File[]>([])

  /**
   * 실제 source of truth
   */
  const files = isControlled ? value! : internalFiles

  /**
   * previews는 files로부터 계산 가능한 값
   */
  const previews = useMemo(() => files.map(file => URL.createObjectURL(file)), [files])

  /**
   * 메모리 해제
   */
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previews])

  /**
   * 상태 업데이트 helper
   */
  const updateFiles = (next: File[]) => {
    if (isControlled) {
      onChange(next)
    } else {
      setInternalFiles(next)
    }
  }

  /**
   * 파일 추가
   */
  const addFiles = async (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList)

    const compressed = await Promise.all(incoming.map(file => compressAndFormatImage(file)))

    const next = [...files, ...compressed].slice(0, max)

    updateFiles(next)
  }

  /**
   * 삭제
   */
  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index])
    updateFiles(files.filter((_, i) => i !== index))
  }

  const clear = () => updateFiles([])

  return {
    files,
    previews,

    addFiles,
    removeFile,
    clear,

    count: files.length,
    max,
    isFull: files.length >= max,
  }
}
