import imageCompression from 'browser-image-compression'

export interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  fileType?: 'image/webp' | 'image/jpeg' | 'image/png'
}

// MIME 타입을 확장자로 변환하는 매퍼
const EXTENSION_MAP: Record<string, string> = {
  'image/webp': '.webp',
  'image/jpeg': '.jpg',
  'image/png': '.png',
}

/**
 * 이미지를 압축하고 지정된 포맷으로 변환합니다.
 */
export async function compressAndFormatImage(
  file: File,
  options: CompressionOptions = {},
): Promise<File> {
  const {
    // maxSizeMB = 1,
    // maxWidthOrHeight = 1920,
    maxSizeMB = 0.5,
    maxWidthOrHeight = 1280,
    fileType = 'image/webp', // 기본적으로 webp로 통일
  } = options

  const compressionOptions = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType,
  }

  try {
    const compressedBlob = await imageCompression(file, compressionOptions)

    // 1. 원본 파일명에서 확장자 제거
    const baseFileName = file.name.replace(/\.[^/.]+$/, '')

    // 2. 전달된 fileType에 맞는 확장자 가져오기 (없으면 .jpg 기본값)
    const extension = EXTENSION_MAP[fileType] || '.jpg'

    // 3. 최종 파일명 결합
    const finalFileName = `${baseFileName}${extension}`

    // 4. 변환된 Blob을 새로운 File 객체로 반환
    return new File([compressedBlob], finalFileName, { type: fileType })
  } catch (error) {
    console.error('Image compression/formatting failed:', error)
    throw error
  }
}
