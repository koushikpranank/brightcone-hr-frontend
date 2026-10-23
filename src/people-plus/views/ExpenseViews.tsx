import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'
import { inr, avatarColor, initials } from '../helpers'

export const ExpenseViews: React.FC = () => {
  const { state, user, openModal, approveExpense, rejectExpense, payExpense } = usePeoplePlus()
  const [tab, setTab] = useState<'claims' | 'my' | 'office'>('claims')

  const pendingClaims = state.expenses.filter((e) => e.status === 'Pending')
  const myClaims = state.expenses.filter((e) => e.emp === (user?.name || 'Rahul Varma'))
  const totalSpend = state.expenses.reduce((a, e) => a + e.amt, 0)

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Expense & Finance</div>
          <h1>Expense Management</h1>
          <p>Review team reimbursement claims, audit digital receipts, and track operational expenditure.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => openModal('claimExpense')}>
            <Icon name="plus" size={16} /> Claim expense
          </button>
        </div>
      </div>

      <div className="tabs mb">
        <button className={tab === 'claims' ? 'on' : ''} onClick={() => setTab('claims')}>
          Review claims ({pendingClaims.length})
        </button>
        <button className={tab === 'my' ? 'on' : ''} onClick={() => setTab('my')}>
          My expenses ({myClaims.length})
        </button>
        <button className={tab === 'office' ? 'on' : ''} onClick={() => setTab('office')}>
          Office & Vendor spend
        </button>
      </div>

      <div className="grid g3 mt">
        <div className="card stat">
          <div className="k"><i><Icon name="receipt" size={16} /></i> Total claims filed</div>
          <div className="v">{inr(totalSpend)}</div>
          <div className="d">{state.expenses.length} claims in total</div>
        </div>
        <div className="card stat">
          <div className="k"><i><Icon name="clock" size={16} /></i> Awaiting approval</div>
          <div className="v">{inr(pendingClaims.reduce((a, e) => a + e.amt, 0))}</div>
          <div className="d down">{pendingClaims.length} claims need review</div>
        </div>
        <div className="card stat">
          <div className="k"><i><Icon name="check" size={16} /></i> Average turnaround</div>
          <div className="v">1.4 days</div>
          <div className="d up">Faster than industry avg</div>
        </div>
      </div>

      {tab === 'claims' && (
        <div className="card mt">
          <h3>Team Expense Claims</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.expenses.map((ex) => (
                  <tr key={ex.id}>
                    <td>
                      <div className="who">
                        <div className="av" style={{ background: avatarColor(ex.emp) }}>{initials(ex.emp)}</div>
                        <b>{ex.emp}</b>
                      </div>
                    </td>
                    <td><span className="pill p-info">{ex.cat}</span></td>
                    <td>{ex.date}</td>
                    <td>{ex.desc}</td>
                    <td><b>{inr(ex.amt)}</b></td>
                    <td>
                      <span className={`pill ${ex.status === 'Paid' ? 'p-ok' : ex.status === 'Approved' ? 'p-info' : ex.status === 'Rejected' ? 'p-bad' : 'p-warn'}`}>
                        {ex.status}
                      </span>
                    </td>
                    <td>
                      {ex.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn sm ok" onClick={() => approveExpense(ex.id)}>Approve</button>
                          <button className="btn sm bad" onClick={() => rejectExpense(ex.id)}>Reject</button>
                        </div>
                      ) : ex.status === 'Approved' ? (
                        <button className="btn sm primary" onClick={() => payExpense(ex.id)}>Disburse</button>
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

      {tab === 'my' && (
        <div className="card mt">
          <h3>My Expense Claims</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myClaims.map((ex) => (
                  <tr key={ex.id}>
                    <td><span className="pill p-info">{ex.cat}</span></td>
                    <td>{ex.date}</td>
                    <td>{ex.desc}</td>
                    <td><b>{inr(ex.amt)}</b></td>
                    <td>
                      <span className={`pill ${ex.status === 'Paid' ? 'p-ok' : ex.status === 'Approved' ? 'p-info' : ex.status === 'Rejected' ? 'p-bad' : 'p-warn'}`}>
                        {ex.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'office' && (
        <div className="card mt">
          <h3>Office & Facilities Spend</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Vendor</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="pill p-info">Rent & Office</span></td>
                  <td><b>Aparna Realty Ltd</b></td>
                  <td>Hyderabad HQ office lease — October</td>
                  <td><b>{inr(450000)}</b></td>
                  <td><span className="pill p-ok">Paid</span></td>
                </tr>
                <tr>
                  <td><span className="pill p-info">Internet & Cloud</span></td>
                  <td><b>Tata Tele / AWS</b></td>
                  <td>Dedicated 1 Gbps fiber line & GPU nodes</td>
                  <td><b>{inr(185000)}</b></td>
                  <td><span className="pill p-ok">Paid</span></td>
                </tr>
                <tr>
                  <td><span className="pill p-info">Pantry & Supplies</span></td>
                  <td><b>Blue Tokai / Snacks</b></td>
                  <td>Office pantry supplies for all floors</td>
                  <td><b>{inr(42000)}</b></td>
                  <td><span className="pill p-ok">Paid</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
