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
