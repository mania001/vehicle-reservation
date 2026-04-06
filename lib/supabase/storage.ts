import { createClient } from './client'

export interface UploadResponse {
  path: string
  publicUrl: string
}

/**
 * Supabase Storage에 파일을 업로드하고 Public URL을 반환합니다.
 */
export async function uploadFileToSupabase(
  file: File,
  bucket: string,
  path: string,
): Promise<UploadResponse> {
  const supabase = createClient()

  // 1. 파일 업로드
  const { data, error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true, // 동일 경로 파일 덮어쓰기 허용 여부
  })

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  // 2. Public URL 가져오기
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path)

  return {
    path: data.path,
    publicUrl,
  }
}

/**
 * 여러 파일을 동시에 업로드합니다.
 */
export async function uploadMultipleFiles(
  files: File[],
  bucket: string,
  folderPath: string,
): Promise<UploadResponse[]> {
  const uploadPromises = files.map(file => {
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${file.name}`
    const fullPath = `${folderPath}/${fileName}`
    return uploadFileToSupabase(file, bucket, fullPath)
  })

  return Promise.all(uploadPromises)
}

/**
 * Supabase Storage 파일 경로를 받아 접근 가능한 URL을 반환합니다.
 * @param bucket 버킷 이름 (예: 'images')
 * @param path 파일 경로 (예: 'usage/c58e.../photo.webp')
 * @param isPrivate 비공개 버킷 여부 (기본값: false)
 * @param expiresIn 세션 유지 시간 (Private일 경우만 해당, 초 단위)
 */
export async function getStorageUrl(
  bucket: string,
  path: string,
  isPrivate: boolean = false,
  expiresIn: number = 3600, // 기본 1시간
) {
  if (!path) return null

  const supabase = createClient()
  if (isPrivate) {
    console.log('Generating signed URL for private bucket:', bucket, path)
    // Private 버킷: Signed URL 생성 (비동기)
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

    if (error) {
      console.error('Error creating signed URL:', error.message)
      return null
    }
    return data.signedUrl
  } else {
    // Public 버킷: 단순 URL 반환 (동기)
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }
}
