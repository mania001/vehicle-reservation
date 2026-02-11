'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ReservationTabId } from '../constants/reservation-tabs'
import { approveReservation, ApproveReservationPayload } from '../api/approve-reservatiton'
import { adminReservationQueryKeys } from '../query-keys'
import { AdminReservationListItem, ReservationCountsResponse } from '../types/reservaiton-list-item'

/**
 * 탭 이동 규칙
 * - pending 승인 → need_car 로 이동
 * - need_car 승인+배차 → return_check(또는 done?)로 이동하는게 아니라,
 *   "운행 탭"으로 넘어가겠지만 지금 reservations 탭 기준에서는 need_car에서 제거만 하면 됨.
 *
 * 여기서는 reservations 탭 구조 기준으로만 counts 이동 처리.
 */
function getNextTabAfterApprove(currentTab: ReservationTabId): ReservationTabId | null {
  if (currentTab === 'pending') return 'need_car'
  return null
}

/**
 * optimistic counts 업데이트 규칙
 */
function applyOptimisticCountsUpdate(
  prev: ReservationCountsResponse,
  currentTab: ReservationTabId,
) {
  const next = { ...prev }

  // 현재 탭에서 제거
  next[currentTab] = Math.max(0, (next[currentTab] ?? 0) - 1)

  // pending -> need_car 이동
  const nextTab = getNextTabAfterApprove(currentTab)
  if (nextTab) {
    next[nextTab] = (next[nextTab] ?? 0) + 1
  }

  return next
}

export function useApproveReservationMutation(currentTab: ReservationTabId) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: ApproveReservationPayload) => approveReservation(payload),

    onMutate: async payload => {
      // 1) invalidate 중단 (경쟁 방지)
      await qc.cancelQueries({ queryKey: adminReservationQueryKeys.all() })
      await qc.cancelQueries({ queryKey: adminReservationQueryKeys.counts() })

      // 2) snapshot 저장 (rollback용)
      const prevCounts = qc.getQueryData<ReservationCountsResponse>(
        adminReservationQueryKeys.counts(),
      )

      const prevListRaw = qc.getQueryData<AdminReservationListItem[]>(
        adminReservationQueryKeys.list(currentTab),
      )
      const prevList = Array.isArray(prevListRaw) ? prevListRaw : []

      // 3) list에서 즉시 제거
      if (prevList) {
        qc.setQueryData<AdminReservationListItem[]>(
          adminReservationQueryKeys.list(currentTab),
          prevList.filter(x => x.reservationId !== payload.reservationId),
        )
      }

      // 4) counts 즉시 업데이트
      if (prevCounts) {
        // 승인대기(pending)에서 승인하면 need_car 또는 return_check 등으로 이동할 수 있지만
        // "정확한 이동처리"는 서버 상태 기반이라 어려움.
        // 실무에서는 일단 현재 탭 count 감소만 즉시 처리하고,
        // 이후 invalidate로 서버가 최종 정답을 맞추게 하는게 UX적으로 가장 깔끔함.
        qc.setQueryData<ReservationCountsResponse>(adminReservationQueryKeys.counts(), old => {
          if (!old) return old
          return applyOptimisticCountsUpdate(old, currentTab)
        })
      }

      return { prevList, prevCounts }
    },

    onError: (_err, _payload, ctx) => {
      // 실패하면 rollback
      if (ctx?.prevList) {
        qc.setQueryData(adminReservationQueryKeys.list(currentTab), ctx.prevList)
      }

      if (ctx?.prevCounts) {
        qc.setQueryData(adminReservationQueryKeys.counts(), ctx.prevCounts)
      }
    },

    onSettled: async () => {
      // 5) 백그라운드 검증 fetch (정답 동기화)
      qc.invalidateQueries({ queryKey: adminReservationQueryKeys.list(currentTab) })
      qc.invalidateQueries({ queryKey: adminReservationQueryKeys.counts() })

      // pending 승인하면 need_car도 갱신해야 정확함
      const nextTab = getNextTabAfterApprove(currentTab)
      if (nextTab) {
        await qc.invalidateQueries({
          queryKey: adminReservationQueryKeys.list(nextTab),
        })
      }
    },
  })
}
