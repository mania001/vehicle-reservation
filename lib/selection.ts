type SelectionState = Record<string, boolean | null>

export function selectionToRows(checkId: string, selections: SelectionState) {
  return Object.entries(selections)

    .filter(([_, value]) => value !== null)

    .map(([key, value]) => ({
      checkId,

      key,

      value: value as boolean,
    }))
}
