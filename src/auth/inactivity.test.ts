import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { watchInactivity } from './inactivity'

const IDLE_LIMIT = 15 * 60 * 1000
const ACTIVITY_KEY = 'brightcone:last-activity'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-10-23T00:00:00Z'))
  localStorage.clear()
})

afterEach(() => {
  vi.useRealTimers()
  localStorage.clear()
})

describe('15-minute inactivity timeout', () => {
  it('expires after a full idle interval and resets on user input', () => {
    const expire = vi.fn()
    const stop = watchInactivity(expire, IDLE_LIMIT)

    vi.advanceTimersByTime(14 * 60 * 1000)
    window.dispatchEvent(new Event('pointerdown'))
    vi.advanceTimersByTime(IDLE_LIMIT - 1)
    expect(expire).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(expire).toHaveBeenCalledOnce()
    stop()
  })

  it('uses recent activity in another browser tab', () => {
    const expire = vi.fn()
    const stop = watchInactivity(expire, IDLE_LIMIT)

    vi.advanceTimersByTime(14 * 60 * 1000)
    localStorage.setItem(ACTIVITY_KEY, String(Date.now()))
    window.dispatchEvent(new StorageEvent('storage', { key: ACTIVITY_KEY }))
    vi.advanceTimersByTime(IDLE_LIMIT - 1)
    expect(expire).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(expire).toHaveBeenCalledOnce()
    stop()
  })
})
