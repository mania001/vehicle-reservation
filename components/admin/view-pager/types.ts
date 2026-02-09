export type AdminTabItem<TTabId extends string> = {
  id: TTabId
  label: string
  badgeCount?: number
}
