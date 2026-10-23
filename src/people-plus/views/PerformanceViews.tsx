import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'
import { avatarColor, initials } from '../helpers'

export const PerformanceViews: React.FC = () => {
  const { state, updateGoal, openModal, toast } = usePeoplePlus()
  const [tab, setTab] = useState<'goals' | 'reviews' | 'feedback'>('goals')

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Performance & Career</div>
          <h1>Performance Management</h1>
          <p>Track quarterly OKRs, conduct 360-degree appraisals, and reward high performers.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => openModal('addGoal')}>
            <Icon name="plus" size={16} /> New goal / OKR
          </button>
        </div>
      </div>

      <div className="tabs mb">
        <button className={tab === 'goals' ? 'on' : ''} onClick={() => setTab('goals')}>
          Goals & OKRs ({state.goals.length})
        </button>
        <button className={tab === 'reviews' ? 'on' : ''} onClick={() => setTab('reviews')}>
          Appraisal cycle ({state.cycle.n})
        </button>
        <button className={tab === 'feedback' ? 'on' : ''} onClick={() => setTab('feedback')}>
          360 feedback ({state.feedback.length})
        </button>
      </div>

      {tab === 'goals' && (
        <div className="grid g2 mt">
          {state.goals.map((g) => (
            <div key={g.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="pill p-info">Due {g.due}</span>
                <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--brand)' }}>{g.p}%</span>
              </div>
              <h3 style={{ marginBottom: '8px' }}>{g.t}</h3>
              <p className="muted" style={{ fontSize: '13px', marginBottom: '14px' }}>Owner: {g.emp}</p>
              <div className="bar" style={{ marginBottom: '16px' }}>
                <span style={{ width: `${g.p}%` }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={g.p}
                  style={{ flex: 1, accentColor: 'var(--brand)' }}
                  onChange={(e) => updateGoal(g.id, Number(e.target.value))}
                />
                <button className="btn sm" onClick={() => toast(`Goal ${g.id} progress updated to ${g.p}%`)}>
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="card mt">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3>{state.cycle.n}</h3>
              <span className="muted">Due deadline: {state.cycle.due} · Stage: Manager Evaluation</span>
            </div>
            <span className="pill p-warn">Active review window</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Manager</th>
                  <th>Self Review</th>
                  <th>Manager Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.employees.slice(0, 6).map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div className="who">
                        <div className="av" style={{ background: avatarColor(e.name) }}>{initials(e.name)}</div>
                        <b>{e.name}</b>
                      </div>
                    </td>
                    <td>{e.mgr || 'Naresh Vemparala'}</td>
                    <td><span className="pill p-ok">Submitted</span></td>
                    <td><b>4.5 / 5.0</b></td>
                    <td><span className="pill p-info">In review</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'feedback' && (
        <div className="grid g2 mt">
          {state.feedback.map((f, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div className="av" style={{ background: avatarColor(f.from) }}>{initials(f.from)}</div>
                <div>
                  <b>{f.from}</b> <span className="muted">→ {f.to}</span>
                  <div className="muted" style={{ fontSize: '12px' }}>{f.d}</div>
                </div>
              </div>
              <p style={{ lineHeight: 1.6, fontSize: '14px' }}>“{f.t}”</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
