import React, { useState } from 'react'
import { useEmployees } from '@/features/people/api'
import { useAuth } from '@/auth/useAuth'
import { Icon } from '../Icon'
import { avatarColor, initials } from '../helpers'

export const ShiftViews: React.FC = () => {
  const { can } = useAuth()
  const allowed = can('people:manage') || can('users:manage')
  const employees = useEmployees(allowed)

  const [tab, setTab] = useState<'roster' | 'config'>('roster')

  const empList = employees.data ?? []

  const daysOfWeek = [
    { name: 'Mon', date: 'Oct 12' },
    { name: 'Tue', date: 'Oct 13' },
    { name: 'Wed', date: 'Oct 14' },
    { name: 'Thu', date: 'Oct 15' },
    { name: 'Fri', date: 'Oct 16' },
    { name: 'Sat', date: 'Oct 17' },
    { name: 'Sun', date: 'Oct 18' },
  ]

  if (employees.isLoading) {
    return <div className="loader">Loading shift data…</div>
  }

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Shift & Schedule</div>
          <h1>Shift Roster & Timetable</h1>
          <p>Weekly rotations, shift swaps, and attendance management.</p>
        </div>
      </div>

      <div className="tabs mb">
        <button className={tab === 'roster' ? 'on' : ''} onClick={() => setTab('roster')}>
          Roster ({empList.length})
        </button>
        <button className={tab === 'config' ? 'on' : ''} onClick={() => setTab('config')}>
          Configuration
        </button>
      </div>

      {tab === 'roster' && (
        <div className="card mt">
          {empList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Icon name="calendar" size={32} />
              <h3 style={{ marginTop: 12 }}>No employees to schedule</h3>
              <p className="muted" style={{ marginTop: 8 }}>
                Add employees via the People API to populate the shift roster.
              </p>
            </div>
          ) : (
            <>
              <h3>Weekly Roster</h3>
              <p className="muted" style={{ marginBottom: 14 }}>
                Employee roster from the People API. Shift assignment requires a dedicated shift API.
              </p>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      {daysOfWeek.map((d) => (
                        <th key={d.name}>{d.name}<span style={{ display: 'block', fontSize: 11 }}>{d.date}</span></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {empList.slice(0, 10).map((emp) => {
                      const name = `${emp.first_name} ${emp.last_name}`
                      return (
                        <tr key={emp.id}>
                          <td>
                            <div className="who">
                              <div className="av" style={{ background: avatarColor(name) }}>
                                {initials(name)}
                              </div>
                              <b>{name}</b>
                            </div>
                          </td>
                          {daysOfWeek.map((d, i) => (
                            <td key={d.name}>
                              <span className={`pill ${i >= 5 ? 'p-bad' : 'p-ok'}`}>
                                {i >= 5 ? 'OFF' : 'GEN'}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'config' && (
        <div className="card mt">
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Icon name="gear" size={32} />
            <h3 style={{ marginTop: 12 }}>Shift configuration coming soon</h3>
            <p className="muted" style={{ marginTop: 8 }}>
              Shift timings, swap requests, and attendance regularisations
              require a dedicated shift management API.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
