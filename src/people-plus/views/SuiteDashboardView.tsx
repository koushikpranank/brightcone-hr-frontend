import React from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { useEmployees, useReferences } from '@/features/people/api'
import { useRuleMetrics } from '@/features/advanced-hr/api'
import { useAuth } from '@/auth/useAuth'
import { Icon } from '../Icon'
import { APPS } from '../data'
import { avatarColor, initials } from '../helpers'

export const SuiteDashboardView: React.FC = () => {
  const { user, viewAs, setActiveApp, setActiveView, openModal } = usePeoplePlus()
  const { can } = useAuth()
  const allowed = can('people:manage') || can('users:manage')

  const employees = useEmployees(allowed)
  const departments = useReferences('departments', allowed)
  const locations = useReferences('locations', allowed)
  const metrics = useRuleMetrics(allowed)

  const effectiveRole = viewAs || user?.role || 'Employee'
  const isAdmin = effectiveRole === 'HR Admin'
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening'

  const empList = employees.data ?? []
  const deptList = departments.data ?? []
  const locList = locations.data ?? []
  const m = metrics.data

  const activeCount = empList.filter((e) => e.status === 'active').length
  const probationCount = empList.filter((e) => e.status === 'probation').length
  const pendingRules = m?.pending ?? 0

  if (employees.isLoading) {
    return <div className="loader">Loading dashboard…</div>
  }

  return (
    <div className="view">
      {isAdmin ? (
        <>
          <div className="head band">
            <div>
              <div className="eyebrow">Enterprise Suite</div>
              <h1>{greeting}, {user?.name.split(' ')[0] || 'Leader'}</h1>
              <p>
                Here is Brightcone today, {new Date().toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                })}.
              </p>
            </div>
            <div className="actions">
              <button className="btn" onClick={() => { setActiveApp('plus'); setActiveView('approvals') }}>
                <Icon name="inbox" size={16} /> Approvals
              </button>
              <button className="btn primary" onClick={() => openModal('addEmp')}>
                <Icon name="plus" size={16} /> Add employee
              </button>
            </div>
          </div>

          <div className="grid g4 mt">
            <div className="card stat">
              <div className="k"><i><Icon name="users" size={16} /></i> Active Workforce</div>
              <div className="v">{activeCount}</div>
              <div className="d up">Across {locList.length} location{locList.length !== 1 ? 's' : ''}</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="clock" size={16} /></i> On Probation</div>
              <div className="v">{probationCount}</div>
              <div className="d">{probationCount > 0 ? 'Review pending' : 'All confirmed'}</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="org" size={16} /></i> Departments</div>
              <div className="v">{deptList.length}</div>
              <div className="d">Active departments</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="shield" size={16} /></i> Rule Engine</div>
              <div className="v">{pendingRules} pending</div>
              <div className="d">{m ? `${m.complete} complete, ${m.failed} failed` : 'Loading…'}</div>
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
                <p>{app.description}</p>
              </button>
            ))}
          </div>

          <div className="grid g2 mt">
            <div className="card">
              <h3>Department Breakdown</h3>
              <div className="dept-bars wide" style={{ marginTop: 14 }}>
                {deptList.map((d) => {
                  const count = empList.filter((e) => e.department_id === d.id).length
                  const pct = empList.length > 0 ? Math.round((count / empList.length) * 100) : 0
                  return (
                    <div key={d.id} className="r">
                      <span>{d.label}</span>
                      <div className="bar"><span style={{ width: `${pct}%` }} /></div>
                      <em>{count}</em>
                    </div>
                  )
                })}
                {deptList.length === 0 && <p className="muted">No departments configured.</p>}
              </div>
            </div>

            <div className="card">
              <h3>Recent Employees</h3>
              <div className="list">
                {empList.slice(0, 5).map((emp) => {
                  const name = `${emp.first_name} ${emp.last_name}`
                  return (
                    <div key={emp.id} className="row">
                      <div className="av" style={{ background: avatarColor(name) }}>{initials(name)}</div>
                      <div className="grow">
                        <b>{name}</b>
                        <div className="sub">{emp.work_email}</div>
                      </div>
                      <span className={`pill ${emp.status === 'active' ? 'p-ok' : 'p-warn'}`}>
                        {emp.status}
                      </span>
                    </div>
                  )
                })}
                {empList.length === 0 && (
                  <div className="empty">No employees yet — add one to get started.</div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="head band">
            <div>
              <div className="eyebrow">My Dashboard</div>
              <h1>{greeting}, {user?.name.split(' ')[0] || 'there'}</h1>
              <p>Your People Plus self-service portal.</p>
            </div>
          </div>

          <h2 className="sect">Quick Actions</h2>
          <div className="quick">
            <button onClick={() => { setActiveApp('people'); setActiveView('myDocs') }}>
              <i><Icon name="doc" size={18} /></i>
              My documents
            </button>
            <button onClick={() => { setActiveApp('people'); setActiveView('myPerformance') }}>
              <i><Icon name="chart" size={18} /></i>
              Goals & reviews
            </button>
            <button onClick={() => { setActiveApp('connect'); setActiveView('feed') }}>
              <i><Icon name="chat" size={18} /></i>
              Company feed
            </button>
            <button onClick={() => { setActiveApp('learn'); setActiveView('myLearning') }}>
              <i><Icon name="learn" size={18} /></i>
              My learning
            </button>
          </div>

          <h2 className="sect">Applications</h2>
          <div className="apps-grid">
            {APPS.filter((a) => a.key !== 'plus').map((app) => (
              <button
                key={app.key}
                className="appcard"
                style={{ '--c': app.color } as React.CSSProperties}
                onClick={() => { setActiveApp(app.key); setActiveView(`${app.key}Dash`) }}
              >
                <div className="t">
                  <i><Icon name={app.icon} size={18} /></i>
                  <b>{app.name}</b>
                  <span className="go"><Icon name="arrow" size={16} /></span>
                </div>
                <p>{app.description}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
