import React, { useState } from 'react'
import { useAdminUsers, useDisableUser, useUnlockUser } from './api'
import { AccessErrorBoundary } from './ErrorBoundary'
import { Icon } from '@/people-plus/Icon'
import { avatarColor, initials } from '@/people-plus/helpers'

function AccessContent() {
  const users = useAdminUsers(true)
  const disable = useDisableUser()
  const unlock = useUnlockUser()
  const [search, setSearch] = useState('')

  if (users.isLoading) {
    return <div className="loader">Loading users…</div>
  }

  if (users.error) {
    return (
      <section className="glass" style={{ maxWidth: 720, margin: '48px auto', padding: 32 }}>
        <h2>Could not load user accounts</h2>
        <p className="muted">The admin API is not reachable.</p>
      </section>
    )
  }

  const list = (users.data ?? []).filter((u) =>
    !search || u.name.toLowerCase().includes(search.toLowerCase())
    || u.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Access Control</div>
          <h1>User Accounts & Permissions</h1>
          <p>Manage portal accounts, roles, and access status.</p>
        </div>
      </div>

      <div className="card mt">
        <div className="toolbar">
          <div className="search">
            <Icon name="search" size={16} />
            <input
              className="input"
              type="search"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.pid}>
                  <td>
                    <div className="who">
                      <div className="av" style={{ background: avatarColor(u.name) }}>
                        {initials(u.name)}
                      </div>
                      <div>
                        <b>{u.name}</b>
                        <span>{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="pill p-info">{u.role}</span></td>
                  <td>
                    <span className={`pill ${u.status === 'active' ? 'p-ok' : 'p-bad'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="muted">{u.last_login_at?.slice(0, 10) ?? 'Never'}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    {u.status === 'active' && (
                      <button
                        className="btn sm ib"
                        title="Disable account"
                        onClick={() => disable.mutate(u.pid)}
                      >
                        <Icon name="lock" size={15} />
                      </button>
                    )}
                    {u.status !== 'active' && (
                      <button
                        className="btn sm ib"
                        title="Unlock account"
                        onClick={() => unlock.mutate(u.pid)}
                      >
                        <Icon name="unlock" size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted" style={{ textAlign: 'center' }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export const AccessPage: React.FC = () => (
  <AccessErrorBoundary>
    <AccessContent />
  </AccessErrorBoundary>
)
