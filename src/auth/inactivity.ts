const ACTIVITY_KEY = 'brightcone:last-activity'
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'pointerdown',
  'pointermove',
  'keydown',
  'touchstart',
  'wheel',
]

export function watchInactivity(onExpire: () => void, idleLimit: number) {
  let lastActivity = Date.now()
  let lastPublished = lastActivity
  let timer = 0

  const readActivity = () => {
    try {
      const stored = Number(localStorage.getItem(ACTIVITY_KEY))
      if (Number.isFinite(stored) && stored <= Date.now()) {
        lastActivity = Math.max(lastActivity, stored)
      }
    } catch {
      // Keep the in-memory timeout active when browser storage is unavailable.
    }
    return lastActivity
  }
  const schedule = () => {
    window.clearTimeout(timer)
    const remaining = idleLimit - (Date.now() - readActivity())
    timer = window.setTimeout(
      () => {
        if (Date.now() - readActivity() >= idleLimit) onExpire()
        else schedule()
      },
      Math.max(0, remaining),
    )
  }
  const publishActivity = () => {
    const now = Date.now()
    lastActivity = now
    try {
      localStorage.setItem(ACTIVITY_KEY, String(now))
    } catch {
      // Keep the in-memory timeout active when browser storage is unavailable.
    }
    schedule()
  }
  const touch = () => {
    const now = Date.now()
    lastActivity = now
    if (now - lastPublished >= 1000) {
      lastPublished = now
      publishActivity()
    } else schedule()
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === ACTIVITY_KEY) schedule()
  }

  publishActivity()
  ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, touch, { passive: true }))
  window.addEventListener('storage', onStorage)
  return () => {
    window.clearTimeout(timer)
    ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, touch))
    window.removeEventListener('storage', onStorage)
  }
}
