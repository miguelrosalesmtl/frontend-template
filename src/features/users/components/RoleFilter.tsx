import { useUiStore } from '@/store/ui.store'

export function RoleFilter() {
  const theme = useUiStore((s) => s.theme)
  return <div>{theme}</div>
}
