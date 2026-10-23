import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'
import { avatarColor, initials } from '../helpers'

export const ShiftViews: React.FC = () => {
  const { state, openModal, toast } = usePeoplePlus()
  const [tab, setTab] = useState<'roster' | 'swaps' | 'attendance' | 'shifts'>('roster')

  const daysOfWeek = [
    { name: 'Mon', date: 'Oct 12' },
    { name: 'Tue', date: 'Oct 13' },
    { name: 'Wed', date: 'Oct 14' },
    { name: 'Thu', date: 'Oct 15' },
    { name: 'Fri', date: 'Oct 16' },
    { name: 'Sat', date: 'Oct 17' },
    { name: 'Sun', date: 'Oct 18' },
  ]

  const shiftColors: Record<string, string> = {
    'General': 'var(--brand)',
    'US Pacific': '#7C5CFF',
    'US Central': '#E0811D',
    'Night support': '#D9466F',
    'Off': 'var(--muted)',
  }

  const handleCellClick = (emp: string, day: string) => {
    toast(`Changing shift for ${emp} on ${day}`)
  }

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Shift & Schedule</div>
          <h1>Shift Roster & Timetable</h1>
          <p>Plan weekly rotations, manage shift swaps, and verify attendance regularisations.</p>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => openModal('requestSwap')}>
            <Icon name="swap" size={16} /> Request shift swap
          </button>
          <button className="btn primary" onClick={() => toast('Weekly roster published to all teams!')}>
            <Icon name="check" size={16} /> Publish roster
          </button>
        </div>
      </div>

      <div className="tabs mb">
        <button className={tab === 'roster' ? 'on' : ''} onClick={() => setTab('roster')}>
          Shift roster
        </button>
        <button className={tab === 'swaps' ? 'on' : ''} onClick={() => setTab('swaps')}>
          Swap requests ({state.swaps.filter((s) => s.status === 'Pending').length})
        </button>
        <button className={tab === 'attendance' ? 'on' : ''} onClick={() => setTab('attendance')}>
          Regularisations ({state.regs.filter((r) => r.status === 'Pending').length})
        </button>
        <button className={tab === 'shifts' ? 'on' : ''} onClick={() => setTab('shifts')}>
          Shift timings ({state.shifts.length})
        </button>
      </div>

      {tab === 'roster' && (
        <div className="card mt">
          <div className="toolbar" style={{ justifyContent: 'space-between' }}>
            <div className="legend">
              {state.shifts.map((s) => (
                <span key={s.n}>
                  <i style={{ width: 10, height: 10, borderRadius: 3, background: shiftColors[s.n] || 'var(--brand)', display: 'inline-block' }} />
                  {s.n} ({s.s}–{s.e})
                </span>
              ))}
              <span><i style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--muted)', display: 'inline-block' }} /> Off</span>
            </div>
            <span className="muted" style={{ fontSize: '13px' }}>Click any cell to reassign shift</span>
          </div>

          <div className="table-wrap">
            <table className="roster">
              <thead>
                <tr>
                  <th>Employee</th>
                  {daysOfWeek.map((d, i) => (
                    <th key={d.name} className={i === 2 ? 'today' : ''}>
                      {d.name}
                      <span>{d.date}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {state.employees.slice(0, 8).map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="who">
                        <div className="av" style={{ background: avatarColor(emp.name) }}>
                          {initials(emp.name)}
                        </div>
                        <div>
                          <b>{emp.name}</b>
                          <span>{emp.dept}</span>
                        </div>
                      </div>
                    </td>
                    {daysOfWeek.map((d, i) => {
                      const isWeekend = i >= 5
                      const shiftName = isWeekend ? 'Off' : emp.shift || 'General'
                      const color = shiftColors[shiftName] || 'var(--brand)'
                      return (
                        <td key={d.name} className={i === 2 ? 'today' : ''}>
                          <button
                            className={`chip ${isWeekend ? 'off' : ''}`}
                            style={{ '--c': color } as React.CSSProperties}
                            onClick={() => handleCellClick(emp.name, d.name)}
                          >
                            {isWeekend ? 'OFF' : shiftName === 'Night support' ? 'NS' : shiftName === 'US Pacific' ? 'USP' : shiftName === 'US Central' ? 'USC' : 'GEN'}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'swaps' && (
        <div className="card mt">
          <h3>Shift Swap Requests</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Requester</th>
                  <th>Date</th>
                  <th>Current Shift</th>
                  <th>Requested Shift</th>
                  <th>Swap Partner</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.swaps.map((sw) => (
                  <tr key={sw.id}>
                    <td>
                      <div className="who">
                        <div className="av" style={{ background: avatarColor(sw.emp) }}>{initials(sw.emp)}</div>
                        <b>{sw.emp}</b>
                      </div>
                    </td>
                    <td>{sw.date}</td>
                    <td><span className="pill p-info">{sw.from}</span></td>
                    <td><span className="pill p-ok">{sw.to}</span></td>
                    <td>{sw.with || 'Open for coverage'}</td>
                    <td>{sw.reason}</td>
                    <td>
                      <span className={`pill ${sw.status === 'Approved' ? 'p-ok' : 'p-warn'}`}>
                        {sw.status}
                      </span>
                    </td>
                    <td>
                      {sw.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn sm ok" onClick={() => toast(`Swap request ${sw.id} approved`)}>Approve</button>
                          <button className="btn sm bad" onClick={() => toast(`Swap request ${sw.id} rejected`)}>Reject</button>
                        </div>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'attendance' && (
        <div className="card mt">
          <h3>Attendance Regularisations</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>In Time</th>
                  <th>Out Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.regs.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="who">
                        <div className="av" style={{ background: avatarColor(r.emp) }}>{initials(r.emp)}</div>
                        <b>{r.emp}</b>
                      </div>
                    </td>
                    <td>{r.date}</td>
                    <td>{r.in}</td>
                    <td>{r.out}</td>
                    <td>{r.reason}</td>
                    <td>
                      <span className={`pill ${r.status === 'Approved' ? 'p-ok' : 'p-warn'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn sm ok" onClick={() => toast(`Regularisation ${r.id} approved`)}>Approve</button>
                          <button className="btn sm bad" onClick={() => toast(`Regularisation ${r.id} rejected`)}>Reject</button>
                        </div>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'shifts' && (
        <div className="grid g4 mt">
          {state.shifts.map((s) => (
            <div key={s.n} className="card">
              <h3 style={{ color: shiftColors[s.n] || 'var(--brand)' }}>{s.n}</h3>
              <div style={{ font: '600 24px Sora, sans-serif', margin: '8px 0' }}>
                {s.s} – {s.e}
              </div>
              <div className="muted" style={{ fontSize: '13px' }}>
                Grace period: {s.grace} minutes
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
