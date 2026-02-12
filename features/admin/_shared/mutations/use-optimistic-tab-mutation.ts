'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

export type OptimisticTabMutationConfig<TabId extends string, ListItem, Payload, Result> = {
  mutationFn: (payload: Payload) => Promise<Result>

  currentTab: TabId

  listQueryKey: (tab: TabId) => readonly unknown[]
  countsQueryKey: readonly unknown[]

  getPayloadId: (payload: Payload) => string
  getItemId: (item: ListItem) => string

  getNextTab?: (payload: Payload, currentTab: TabId) => TabId | null

  removeFromCurrentList?: boolean

  getInvalidateTabs?: (payload: Payload, currentTab: TabId) => TabId[]

  /**
   * 성공/실패 side effect (toast 등)
   */
  onSuccessSideEffect?: (result: Result, payload: Payload) => void
  onErrorSideEffect?: (error: unknown, payload: Payload) => void
}

type CountsMap<TabId extends string> = Record<TabId, number>

export function useOptimisticTabMutation<TabId extends string, ListItem, Payload, Result>(
  config: OptimisticTabMutationConfig<TabId, ListItem, Payload, Result>,
) {
  const {
    mutationFn,
    currentTab,
    listQueryKey,
    countsQueryKey,
    getPayloadId,
    getItemId,
    getNextTab,
    removeFromCurrentList = true,
    getInvalidateTabs,
    onSuccessSideEffect,
    onErrorSideEffect,
  } = config

  const qc = useQueryClient()

  return useMutation({
    mutationFn,

    onMutate: async payload => {
      const payloadId = getPayloadId(payload)

      await qc.cancelQueries({ queryKey: listQueryKey(currentTab) })
      await qc.cancelQueries({ queryKey: countsQueryKey })

      const prevCounts = qc.getQueryData<CountsMap<TabId>>(countsQueryKey)

      const prevListRaw = qc.getQueryData<ListItem[]>(listQueryKey(currentTab))
      const prevList = Array.isArray(prevListRaw) ? prevListRaw : []

      if (removeFromCurrentList) {
        qc.setQueryData<ListItem[]>(listQueryKey(currentTab), old => {
          const safe = Array.isArray(old) ? old : []
          return safe.filter(item => getItemId(item) !== payloadId)
        })
      }

      const nextTab = getNextTab?.(payload, currentTab) ?? null

      qc.setQueryData<CountsMap<TabId>>(countsQueryKey, old => {
        if (!old) return old

        const nextCounts: CountsMap<TabId> = { ...old }

        nextCounts[currentTab] = Math.max(0, nextCounts[currentTab] - 1)

        if (nextTab) {
          nextCounts[nextTab] = nextCounts[nextTab] + 1
        }

        return nextCounts
      })

      return {
        prevCounts,
        prevList,
      }
    },

    onError: (err, payload, ctx) => {
      if (ctx?.prevList) {
        qc.setQueryData(listQueryKey(currentTab), ctx.prevList)
      }

      if (ctx?.prevCounts) {
        qc.setQueryData(countsQueryKey, ctx.prevCounts)
      }

      onErrorSideEffect?.(err, payload)
    },

    onSuccess: (result, payload) => {
      onSuccessSideEffect?.(result, payload)
    },

    onSettled: (_data, _err, payload) => {
      qc.invalidateQueries({ queryKey: listQueryKey(currentTab) })
      qc.invalidateQueries({ queryKey: countsQueryKey })

      const tabs = getInvalidateTabs?.(payload, currentTab) ?? []
      for (const tab of tabs) {
        qc.invalidateQueries({ queryKey: listQueryKey(tab) })
      }
    },
  })
}
