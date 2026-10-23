import type { components } from './schema'

const BASE = import.meta.env.VITE_API_URL ?? '/api'

let accessToken: string | null = null
let refreshing: Promise<Session | null> | null = null

export type Me = components['schemas']['MeResponse']
export type Session = components['schemas']['SessionResponse']

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function adoptSession(session: Session) {
  setAccessToken(session.access_token)
}

export function clearAccessToken() {
  accessToken = null
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await request(path, init)
  if (res.status === 401 && accessToken && !path.startsWith('/auth/')) {
    const session = await refreshSession()
    if (session) return parse<T>(await request(path, init))
  }
  return parse<T>(res)
}

export async function refreshSession(): Promise<Session | null> {
  refreshing ??= withRefreshLock(async () =>
    fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'brightcone' },
    }),
  )
    .then(async (res) => {
      if (!res.ok) {
        clearAccessToken()
        window.dispatchEvent(new Event('session-expired'))
        return null
      }
      const session = (await res.json()) as Session
      setAccessToken(session.access_token)
      return session
    })
    .catch(() => {
      clearAccessToken()
      window.dispatchEvent(new Event('session-expired'))
      return null
    })
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

function withRefreshLock(operation: () => Promise<Response>): Promise<Response> {
  const locks = navigator.locks as unknown as {
    request<T>(name: string, callback: () => Promise<T>): Promise<T>
  }
  return locks ? locks.request('brightcone-auth-refresh', operation) : operation()
}

async function request(path: string, init: RequestInit) {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  if (path.startsWith('/auth/logout') || path === '/auth/refresh') {
    headers.set('X-Requested-With', 'brightcone')
  }
  return fetch(`${BASE}${path}`, { ...init, headers, credentials: 'include' })
}

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) throw new ApiError(res.status, res.statusText)
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
