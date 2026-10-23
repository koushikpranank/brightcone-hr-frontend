import { api, type Session } from './client'

export async function signIn(email: string, password: string, remember: boolean) {
  return api<Session>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, remember }),
  })
}

export function signOut(all = false) {
  return api<void>(`/auth/logout${all ? '?all=true' : ''}`, { method: 'POST' })
}

export function changePassword(current_password: string, new_password: string) {
  return api<Session>('/me/password', {
    method: 'PUT',
    body: JSON.stringify({ current_password, new_password }),
  })
}

export function forgotPassword(email: string) {
  return api<{ message: string }>('/auth/forgot', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function resetPassword(token: string, password: string) {
  return api<{ message: string }>('/auth/reset', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  })
}
