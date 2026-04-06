import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // 나중에 Supabase Storage 이미지를 불러올 때를 대비해 미리 추가해두면 좋습니다.
      {
        protocol: 'https',
        hostname: 'bklgcimhclsfsvgwybwj.supabase.co', // 본인의 Supabase 프로젝트 ID로 변경
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // 만약 Signed URL(Private)도 쓴다면 pathname을 더 넓게 잡으세요
      {
        protocol: 'https',
        hostname: 'bklgcimhclsfsvgwybwj.supabase.co', // 본인의 Supabase 프로젝트 ID로 변경
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
  },
}

export default nextConfig
