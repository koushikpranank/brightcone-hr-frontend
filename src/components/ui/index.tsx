export { Alert, Button, Card, EmptyState, PasswordField, Skeleton, TextField } from './primitives'
export { DataTable, type Column } from './data-table'
export { ConfirmDialog, Drawer, FormModal } from './overlays'

export function StatusPill({
  status,
  tone = 'neutral',
  label,
}: {
  status: string
  tone?: 'success' | 'warning' | 'danger' | 'neutral' | 'info'
  label?: string
}) {
  const colors = {
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-rose-100 text-rose-800',
    neutral: 'bg-slate-100 text-slate-700',
    info: 'bg-sky-100 text-sky-800',
  }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[tone]}`}>
      {label ?? status}
    </span>
  )
}
