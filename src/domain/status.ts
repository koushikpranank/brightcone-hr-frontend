export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

export function auditActionTone(action: string): StatusTone {
  const normalized = action.toLowerCase()
  if (normalized.includes('delete') || normalized.includes('disable') || normalized.includes('fail')) {
    return 'danger'
  }
  if (normalized.includes('create') || normalized.includes('enable') || normalized.includes('restore')) {
    return 'success'
  }
  if (normalized.includes('update') || normalized.includes('change')) return 'info'
  return 'neutral'
}
