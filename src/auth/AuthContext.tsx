import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  clearAccessToken,
  refreshSession,
  setAccessToken,
  type Me,
  type Session,
} from '@/api/client'
import { signIn as requestSignIn, signOut as requestSignOut } from '@/api/auth'
import { AuthStateContext } from './context'
import type { AuthState } from './context'
import { watchInactivity } from './inactivity'

const IDLE_LIMIT = 15 * 60 * 1000

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthState['status']>('loading')
  const [user, setUser] = useState<Me | null>(null)
  const [notice, setNotice] = useState<string | null>(() => {
    const value = (history.state?.usr as { notice?: string } | undefined)?.notice ?? null
    return value
  })

  const adopt = useCallback((session: Session) => {
    setAccessToken(session.access_token)
    setUser(session.user)
    setStatus('authenticated')
  }, [])

  const signOut = useCallback(async () => {
    try {
      await requestSignOut()
    } catch {
      /* Session state must clear even when the API is offline. */
    } finally {
      clearAccessToken()
      setUser(null)
      setStatus('anonymous')
    }
  }, [])

  useEffect(() => {
    let active = true
    void refreshSession().then((session) => {
      if (!active) return
      if (session) adopt(session)
      else {
        clearAccessToken()
        setStatus('anonymous')
      }
    })
    return () => {
      active = false
    }
  }, [adopt])

  useEffect(() => {
    const expire = () => {
      clearAccessToken()
      setUser(null)
      setStatus('anonymous')
    }
    window.addEventListener('session-expired', expire)
    return () => window.removeEventListener('session-expired', expire)
  }, [])

  useEffect(() => {
    if (status !== 'authenticated') return
    return watchInactivity(() => void signOut(), IDLE_LIMIT)
  }, [status, signOut])

  const signIn = useCallback(
    async (email: string, password: string, remember: boolean) => {
      const session = await requestSignIn(email, password, remember)
      adopt(session)
      return session.user
    },
    [adopt],
  )
  const value = useMemo<AuthState>(
    () => ({
      status,
      user,
      notice,
      signIn,
      signOut,
      adopt,
      can: (permission) =>
        Boolean(
          user?.permissions.some(
            (granted) => granted === permission || granted.startsWith(`${permission}:`),
          ),
        ),
      clearNotice: () => setNotice(null),
    }),
    [status, user, notice, signIn, signOut, adopt],
  )
  return <AuthStateContext.Provider value={value}>{children}</AuthStateContext.Provider>
}
