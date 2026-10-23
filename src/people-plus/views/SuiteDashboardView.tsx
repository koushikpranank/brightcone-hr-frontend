import React from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'
import { APPS } from '../data'
import { inr, avatarColor, initials } from '../helpers'

export const SuiteDashboardView: React.FC = () => {
  const { state, user, viewAs, activeApp: _activeApp, setActiveApp, setActiveView, toggleClock, openModal, toast } = usePeoplePlus()

  const effectiveRole = viewAs || user?.role || 'Employee'
  const isAdmin = effectiveRole === 'HR Admin'
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening'

  const activeEmployees = state.employees.filter((e) => e.status !== 'Inactive')
  const pendingLeaves = state.leaves.filter((l) => l.status === 'Pending')
  const pendingExpenses = state.expenses.filter((e) => e.status === 'Pending')
  const totalPending = pendingLeaves.length + pendingExpenses.length

  const payTrend = state.payroll.runs.slice(0, 6).reverse()
  const trendMax = Math.max(...payTrend.map((r) => r.gross / 1e5), 1)

  const celebrations = activeEmployees
    .filter((e) => e.dob || e.joined)
    .slice(0, 3)
    .map((e) => ({
      name: e.name,
      type: e.dob ? 'Birthday' : 'Work anniversary',
      detail: e.dept,
    }))

  const upcomingHolidays = state.holidays.slice(0, 3)

  const handleWish = (name: string) => {
    toast(`Sent congratulations to ${name}!`)
  }

  return (
    <div className="view">
      {isAdmin ? (
        <>
          <div className="head band">
            <div>
              <div className="eyebrow">Enterprise Suite</div>
              <h1>{greeting}, {user?.name.split(' ')[0] || 'Leader'}</h1>
              <p>Here is Brightcone today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.</p>
            </div>
            <div className="actions">
              <button className="btn" onClick={() => { setActiveApp('plus'); setActiveView('approvals') }}>
                <Icon name="inbox" size={16} /> Approvals ({totalPending})
              </button>
              <button className="btn primary" onClick={() => openModal('addEmp')}>
                <Icon name="plus" size={16} /> Add employee
              </button>
            </div>
          </div>

          <div className="grid g4 mt">
            <div className="card stat">
              <div className="k"><i><Icon name="users" size={16} /></i> Headcount</div>
              <div className="v">{activeEmployees.length}</div>
              <div className="d up">Across {state.locations.length} locations</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="inbox" size={16} /></i> Pending approvals</div>
              <div className="v">{totalPending}</div>
              <div className="d down">{pendingLeaves.length} leave, {pendingExpenses.length} expense</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="pay" size={16} /></i> Payroll step</div>
              <div className="v">Step {state.payroll.step + 1}/5</div>
              <div className="d">{state.payroll.month} cycle</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="shield" size={16} /></i> Compliance score</div>
              <div className="v">94%</div>
              <div className="d up">High assurance</div>
            </div>
          </div>

          <h2 className="sect">Application Suite</h2>
          <div className="apps-grid">
            {APPS.map((app) => (
              <button
                key={app.key}
                className="appcard"
                style={{ '--c': app.color } as React.CSSProperties}
                onClick={() => { setActiveApp(app.key); setActiveView(app.key === 'plus' ? 'suiteDash' : `${app.key}Dash`) }}
              >
                <div className="t">
                  <i><Icon name={app.icon} size={18} /></i>
                  <b>{app.name}</b>
                  <span className="go"><Icon name="arrow" size={16} /></span>
                </div>
                <div className="m">
                  {app.key === 'people' ? activeEmployees.length : app.key === 'recruit' ? state.jobs.length : app.key === 'expense' ? pendingExpenses.length : 12}
                  <small>{app.key === 'people' ? 'members' : app.key === 'recruit' ? 'roles' : 'items'}</small>
                </div>
                <p>{app.description}</p>
              </button>
            ))}
          </div>

          <div className="grid g-dash mt">
            <div className="card">
              <h3>
                Gross payroll trend (Lakhs INR)
                <button className="link" onClick={() => { setActiveApp('payroll'); setActiveView('payrollDash') }}>Open Payroll</button>
              </h3>
              <div style={{ height: '170px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '16px 0 0' }}>
                {payTrend.map((r, i) => {
                  const val = r.gross / 1e5
                  const pct = Math.max(15, (val / trendMax) * 100)
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 600 }}>₹{val.toFixed(1)}L</span>
                      <div style={{ width: '100%', height: `${pct}%`, background: 'linear-gradient(180deg, var(--brand), color-mix(in srgb, var(--brand) 60%, transparent))', borderRadius: '6px 6px 2px 2px' }} />
                      <span className="muted" style={{ fontSize: '11px' }}>{r.m.slice(0, 3)}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card">
              <h3>
                Approvals waiting
                <button className="link" onClick={() => { setActiveApp('plus'); setActiveView('approvals') }}>Review all</button>
              </h3>
              {pendingLeaves.length === 0 && pendingExpenses.length === 0 ? (
                <div className="empty">You are all caught up!</div>
              ) : (
                <div className="list">
                  {pendingLeaves.slice(0, 3).map((l) => (
                    <div key={l.id} className="row">
                      <div className="av" style={{ background: avatarColor(l.emp) }}>{initials(l.emp)}</div>
                      <div className="grow">
                        <b>{l.emp}</b>
                        <div className="sub">{l.type} · {l.days} day{l.days > 1 ? 's' : ''}</div>
                      </div>
                      <span className="pill p-warn">Leave</span>
                    </div>
                  ))}
                  {pendingExpenses.slice(0, 2).map((e) => (
                    <div key={e.id} className="row">
                      <div className="av" style={{ background: avatarColor(e.emp) }}>{initials(e.emp)}</div>
                      <div className="grow">
                        <b>{e.emp}</b>
                        <div className="sub">{e.cat} · {inr(e.amt)}</div>
                      </div>
                      <span className="pill p-info">Expense</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid g3 mt">
            <div className="card">
              <h3>Upcoming Holidays</h3>
              <div className="list">
                {upcomingHolidays.map((h) => (
                  <div key={h.d} className="row">
                    <div className="dchip">
                      <b>{new Date(h.d).getDate()}</b>
                      {new Date(h.d).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="grow">
                      <b>{h.n}</b>
                      <div className="sub">{h.t} Holiday</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Celebrations this month</h3>
              <div className="list">
                {celebrations.map((c, i) => (
                  <div key={i} className="row">
                    <div className="av" style={{ background: avatarColor(c.name) }}>{initials(c.name)}</div>
                    <div className="grow">
                      <b>{c.name}</b>
                      <div className="sub">{c.type} · {c.detail}</div>
                    </div>
                    <button className="btn sm" onClick={() => handleWish(c.name)}>Wish</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Latest on Connect</h3>
              <div className="list">
                {state.posts.slice(0, 3).map((p) => (
                  <div key={p.id} className="row">
                    <div className="av" style={{ background: avatarColor(p.by) }}>{initials(p.by)}</div>
                    <div className="grow">
                      <b>{p.by}</b> <span className="muted">· {p.type}</span>
                      <div className="sub" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {p.t}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Employee Self-Service Dashboard */
        <>
          <div className="grid g-dash">
            <div className="card hero">
              <h2>Welcome back, {user?.name.split(' ')[0] || 'Rahul'}</h2>
              <p>Your shift today: 09:30 AM – 06:30 PM (General Shift)</p>
              <div className="clock">
                <div>
                  <div className="lbl">Status</div>
                  <div className="time">{state.clockedIn ? state.clockStart || '09:30 AM' : 'Not clocked in'}</div>
                </div>
                <button
                  className={`btn ${state.clockedIn ? 'ghost-light' : 'light'}`}
                  style={{ marginLeft: 'auto' }}
                  onClick={toggleClock}
                >
                  <Icon name={state.clockedIn ? 'stop' : 'play'} size={16} />
                  {state.clockedIn ? 'Clock out' : 'Clock in'}
                </button>
              </div>
            </div>

            <div className="card stat">
              <div className="k"><i><Icon name="leave" size={16} /></i> Leave Balance</div>
              <div className="v">15 <small style={{ fontSize: '14px', color: 'var(--muted)' }}>days remaining</small></div>
              <div className="d up">18 total earned leaves this year</div>
              <div style={{ marginTop: '14px' }}>
                <button className="btn sm primary" onClick={() => openModal('applyLeave')}>
                  <Icon name="plus" size={14} /> Apply leave
                </button>
              </div>
            </div>
          </div>

          <h2 className="sect">Quick Actions</h2>
          <div className="quick">
            <button onClick={() => openModal('applyLeave')}>
              <i><Icon name="leave" size={18} /></i>
              Apply for leave
            </button>
            <button onClick={() => openModal('claimExpense')}>
              <i><Icon name="receipt" size={18} /></i>
              Claim expense
            </button>
            <button onClick={() => openModal('raiseTicket')}>
              <i><Icon name="help" size={18} /></i>
              Raise HR request
            </button>
            <button onClick={() => openModal('requestReg')}>
              <i><Icon name="clock" size={18} /></i>
              Regularise attendance
            </button>
            <button onClick={() => { setActiveApp('payroll'); setActiveView('payslips') }}>
              <i><Icon name="pay" size={18} /></i>
              View latest payslip
            </button>
          </div>

          <div className="grid g3 mt">
            <div className="card">
              <h3>My Leave Requests</h3>
              <div className="list">
                {state.leaves.filter((l) => l.emp === (user?.name || 'Rahul Varma')).slice(0, 3).map((l) => (
                  <div key={l.id} className="row">
                    <div className="grow">
                      <b>{l.type}</b>
                      <div className="sub">{l.from} ({l.days} days)</div>
                    </div>
                    <span className={`pill ${l.status === 'Approved' ? 'p-ok' : l.status === 'Rejected' ? 'p-bad' : 'p-warn'}`}>
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Documents to Sign</h3>
              <div className="list">
                {state.sign.slice(0, 2).map((s) => (
                  <div key={s.id} className="row">
                    <div className="grow">
                      <b>{s.doc}</b>
                      <div className="sub">Due: {s.due}</div>
                    </div>
                    <span className={`pill ${s.status === 'Completed' ? 'p-ok' : 'p-info'}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Announcements</h3>
              <div className="list">
                {state.announcements.map((a) => (
                  <div key={a.id} className="row">
                    <div className="grow">
                      <b>{a.t}</b>
                      <div className="sub">{a.b}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
