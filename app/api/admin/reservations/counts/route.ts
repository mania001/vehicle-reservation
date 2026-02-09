import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    pending: 1,
    need_car: 2,
    return_check: 3,
    issue: 4,
    done: 5,
  })
}
