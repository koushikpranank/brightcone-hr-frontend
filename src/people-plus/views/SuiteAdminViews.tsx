import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'
import { inr, avatarColor, initials } from '../helpers'

export const SuiteAdminViews: React.FC = () => {
  const { state, approveLeave, approveExpense, toast } = usePeoplePlus()
  const [tab, setTab] = useState<'approvals' | 'audit' | 'settings'>('approvals')

  const pendingLeaves = state.leaves.filter((l) => l.status === 'Pending')
  const pendingExpenses = state.expenses.filter((e) => e.status === 'Pending')

  const handleApproveAll = () => {
    pendingLeaves.forEach((l) => approveLeave(l.id))
    pendingExpenses.forEach((e) => approveExpense(e.id))
    toast('All pending approvals processed!')
  }

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Suite Administration</div>
          <h1>Approvals & Governance</h1>
          <p>Consolidated multi-app approvals inbox, immutable audit log, and company policies.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={handleApproveAll}>
            <Icon name="check" size={16} /> Bulk approve all ({pendingLeaves.length + pendingExpenses.length})
          </button>
        </div>
      </div>

      <div className="tabs mb">
        <button className={tab === 'approvals' ? 'on' : ''} onClick={() => setTab('approvals')}>
          Approvals inbox ({pendingLeaves.length + pendingExpenses.length})
        </button>
        <button className={tab === 'audit' ? 'on' : ''} onClick={() => setTab('audit')}>
          Audit log ({state.audit.length})
        </button>
        <button className={tab === 'settings' ? 'on' : ''} onClick={() => setTab('settings')}>
          Workflows & governance
        </button>
      </div>

      {tab === 'approvals' && (
        <div className="card mt">
          <h3>Unified Pending Approvals</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Requester</th>
                  <th>Details</th>
                  <th>Date / Period</th>
                  <th>Amount / Days</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.map((l) => (
                  <tr key={l.id}>
                    <td><span className="pill p-warn">Leave</span></td>
                    <td>
                      <div className="who">
                        <div className="av" style={{ background: avatarColor(l.emp) }}>{initials(l.emp)}</div>
                        <b>{l.emp}</b>
                      </div>
                    </td>
                    <td>{l.type} · {l.reason}</td>
                    <td>{l.from} to {l.to}</td>
                    <td><b>{l.days} days</b></td>
                    <td>
                      <button className="btn sm ok" onClick={() => approveLeave(l.id)}>Approve</button>
                    </td>
                  </tr>
                ))}
                {pendingExpenses.map((e) => (
                  <tr key={e.id}>
                    <td><span className="pill p-info">Expense</span></td>
                    <td>
                      <div className="who">
                        <div className="av" style={{ background: avatarColor(e.emp) }}>{initials(e.emp)}</div>
                        <b>{e.emp}</b>
                      </div>
                    </td>
                    <td>{e.cat} · {e.desc}</td>
                    <td>{e.date}</td>
                    <td><b>{inr(e.amt)}</b></td>
                    <td>
                      <button className="btn sm ok" onClick={() => approveExpense(e.id)}>Approve</button>
                    </td>
                  </tr>
                ))}
                {pendingLeaves.length === 0 && pendingExpenses.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '28px' }} className="muted">
                      No pending approval items waiting in your inbox.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'audit' && (
        <div className="card mt">
          <h3>System Audit Trail</h3>
          <div className="list">
            {state.audit.map((item, i) => (
              <div key={i} className="row">
                <div className="grow">
                  <b>{item.a}</b>
                  <div className="sub">Performed by {item.who} · {item.t}</div>
                </div>
                <span className="pill p-info">Security Verified</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="grid g2 mt">
          <div className="card">
            <h3>Approval Routing Rules</h3>
            <div className="list">
              {state.workflows.map(([module, l1, l2], idx) => (
                <div key={idx} className="row">
                  <div className="grow">
                    <b>{module}</b>
                    <div className="sub">L1: {l1} · L2: {l2}</div>
                  </div>
                  <span className="pill p-ok">Active</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Company Configuration</h3>
            <div className="kv" style={{ marginTop: '12px' }}>
              <dt>Legal Entity</dt>
              <dd><b>{state.company.name}</b></dd>
              <dt>Financial Year</dt>
              <dd>{state.company.fy}</dd>
              <dt>Work Week</dt>
              <dd>{state.company.week}</dd>
              <dt>Timezone</dt>
              <dd>{state.company.tz}</dd>
              <dt>Standard Probation</dt>
              <dd>{state.company.probation}</dd>
              <dt>Standard Notice</dt>
              <dd>{state.company.notice}</dd>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
