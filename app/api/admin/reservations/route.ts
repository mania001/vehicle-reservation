import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tab = searchParams.get('tab') ?? 'pending'

  // TODO: 여기서 실제 DB 조회로 교체
  const dummy = [
    {
      id: '1',
      publicCode: 'ABC123',
      requesterName: '홍길동',
      requesterPhone: '010-1234-5678',
      organization: '서울시청',
      startAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
      purpose: '서버 장비 정기 점검',
      destination: '서울특별시 강남구 테헤란로 123',
      status: tab,
      vehicleName: tab === 'need_car' ? null : '쏘나타 12가3456',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '2',
      publicCode: 'XYZ999',
      requesterName: '김철수',
      requesterPhone: '010-7777-8888',
      organization: '구청',
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
      purpose: '회의 참석',
      destination: '양평',
      status: tab,
      vehicleName: '카니발 88하7777',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ]

  return NextResponse.json({
    items: dummy,
  })
}
