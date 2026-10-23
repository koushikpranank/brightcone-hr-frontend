import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api, clearAccessToken, refreshSession } from './client'
import { employee, jsonResponse, mockApi, sessionFor } from '@/test/fake-api'

beforeEach(clearAccessToken)
afterEach(() => {
  clearAccessToken()
  vi.restoreAllMocks()
})

describe('session restoration', () => {
  it('refreshes from the HttpOnly cookie and uses the restored access token', async () => {
    const session = sessionFor(employee)
    const fake = mockApi({
      'POST /auth/refresh': () => jsonResponse(session),
      'GET /people/employees': () => jsonResponse([]),
    })

    await expect(refreshSession()).resolves.toEqual(session)
    await expect(api('/people/employees')).resolves.toEqual([])

    const refresh = fake.calls[0].init
    expect(refresh?.credentials).toBe('include')
    expect(new Headers(refresh?.headers).get('X-Requested-With')).toBe('brightcone')
    expect(new Headers(fake.calls[1].init?.headers).get('Authorization')).toBe('Bearer access-1')
  })
})
