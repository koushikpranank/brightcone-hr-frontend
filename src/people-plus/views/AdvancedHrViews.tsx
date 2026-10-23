import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'

export const AdvancedHrViews: React.FC = () => {
  const { state, toast } = usePeoplePlus()
  const [tab, setTab] = useState<'analytics' | 'compliance' | 'actions' | 'access' | 'backup'>('analytics')

  const totalEmployees = state.employees.length
  const probationCount = state.employees.filter((e) => e.status === 'Probation').length
  const noticeCount = state.employees.filter((e) => e.status === 'Notice period').length

  const complianceAreas = [
    { name: 'Provident Fund (EPF & MP Act)', score: 98, status: 'Compliant', gaps: 0 },
    { name: 'POSH (Prevention of Sexual Harassment)', score: 92, status: 'Compliant', gaps: 1 },
    { name: 'Gratuity & Labour Welfare Fund', score: 95, status: 'Compliant', gaps: 0 },
    { name: 'Digital Personal Data Protection (DPDP)', score: 88, status: 'In review', gaps: 2 },
    { name: 'Workplace Safety & Fire Drills', score: 96, status: 'Compliant', gaps: 0 },
  ]

  const actions = [
    { title: 'Divya Kulkarni: Collect relieving letter', due: '2026-10-15', pri: 'High', status: 'Due soon' },
    { title: 'Quarterly compliance filing for EPF', due: '2026-10-20', pri: 'High', status: 'Upcoming' },
    { title: 'Review 2 open salary increment proposals', due: '2026-10-22', pri: 'Medium', status: 'Upcoming' },
    { title: 'Update emergency contact numbers in employee master', due: '2026-10-28', pri: 'Low', status: 'Pending' },
  ]

  const roles = ['HR Admin', 'Manager', 'Finance', 'Employee']
  const permissions = [
    { resource: 'Employee Master & Personal Data', access: ['Full', 'Team only', 'Basic info', 'Own profile'] },
    { resource: 'Salary & Compensation Data', access: ['Full', 'None', 'Full', 'Own payslip'] },
    { resource: 'Appraisals & Performance Ratings', access: ['Full', 'Team only', 'None', 'Own rating'] },
    { resource: 'Attendance & Leave Approvals', access: ['Full', 'Team only', 'None', 'Own leaves'] },
    { resource: 'Company Policies & Documents', access: ['Full', 'View only', 'View only', 'View only'] },
  ]

  const handleBackupExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `brightcone-hr-backup-${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    toast('Database backup exported to JSON!')
  }

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Advanced HR Operations</div>
          <h1>Workforce Analytics & Governance</h1>
          <p>Workforce planning metrics, statutory compliance scorecards, and access control governance.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={handleBackupExport}>
            <Icon name="download" size={16} /> Export backup JSON
          </button>
        </div>
      </div>

      <div className="tabs mb">
        <button className={tab === 'analytics' ? 'on' : ''} onClick={() => setTab('analytics')}>
          Workforce analytics
        </button>
        <button className={tab === 'compliance' ? 'on' : ''} onClick={() => setTab('compliance')}>
          HR compliance dashboard
        </button>
        <button className={tab === 'actions' ? 'on' : ''} onClick={() => setTab('actions')}>
          Actions & reminders ({actions.length})
        </button>
        <button className={tab === 'access' ? 'on' : ''} onClick={() => setTab('access')}>
          Access control matrix
        </button>
        <button className={tab === 'backup' ? 'on' : ''} onClick={() => setTab('backup')}>
          Data & backup
        </button>
      </div>

      {tab === 'analytics' && (
        <>
          <div className="grid g4 mt">
            <div className="card stat">
              <div className="k"><i><Icon name="users" size={16} /></i> Active Workforce</div>
              <div className="v">{totalEmployees}</div>
              <div className="d up">100% headcount accounted</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="clock" size={16} /></i> On Probation</div>
              <div className="v">{probationCount}</div>
              <div className="d">6-month review cycle</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="swap" size={16} /></i> Serving Notice</div>
              <div className="v">{noticeCount}</div>
              <div className="d">Planned transitions</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="chart" size={16} /></i> Annualized Retention</div>
              <div className="v">96.2%</div>
              <div className="d up">+2.4% vs last quarter</div>
            </div>
          </div>

          <div className="grid g2 mt">
            <div className="card">
              <h3>Department Distribution</h3>
              <div className="dept-bars wide" style={{ marginTop: '14px' }}>
                {state.depts.map((d) => {
                  const count = state.employees.filter((e) => e.dept === d.n).length
                  const pct = Math.round((count / totalEmployees) * 100)
                  return (
                    <div key={d.n} className="r">
                      <span>{d.n}</span>
                      <div className="bar"><span style={{ width: `${pct}%` }} /></div>
                      <em>{count} ({pct}%)</em>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card">
              <h3>Office Locations & Remote Distribution</h3>
              <div className="dept-bars wide" style={{ marginTop: '14px' }}>
                {state.locations.map((loc) => {
                  const count = state.employees.filter((e) => e.loc === loc).length
                  const pct = Math.round((count / totalEmployees) * 100)
                  return (
                    <div key={loc} className="r">
                      <span>{loc}</span>
                      <div className="bar"><span style={{ width: `${pct}%` }} /></div>
                      <em>{count}</em>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'compliance' && (
        <div className="card mt">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3>Statutory & Regulatory Scorecards</h3>
              <span className="muted">Audited weekly across 5 key employment pillars</span>
            </div>
            <span className="pill p-ok">Overall Compliance: 94%</span>
          </div>

          <div className="compgrid">
            {complianceAreas.map((area) => (
              <div key={area.name} className="card compcard">
                <div className="ct">
                  <b>{area.name}</b>
                  <span className={`pill ${area.score >= 90 ? 'p-ok' : 'p-warn'}`}>{area.status}</span>
                </div>
                <div className="cv" style={{ color: area.score >= 90 ? 'var(--ok)' : 'var(--warn)' }}>
                  {area.score}%
                </div>
                <div className="muted" style={{ fontSize: '13px' }}>
                  {area.gaps === 0 ? 'No open compliance gaps' : `${area.gaps} action item required`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'actions' && (
        <div className="card mt">
          <h3>Required HR Actions & Deadlines</h3>
          <ul className="tline">
            {actions.map((act, i) => (
              <li key={i}>
                <div className="tdot" style={{ '--ac': act.pri === 'High' ? 'var(--bad)' : 'var(--brand)' } as React.CSSProperties}>
                  <Icon name="bell" size={14} />
                </div>
                <div style={{ flex: 1 }}>
                  <b>{act.title}</b>
                  <div className="sub">Due: {act.due} · Priority: {act.pri}</div>
                </div>
                <button className="btn sm primary" onClick={() => toast(`Completed action: ${act.title}`)}>
                  Mark resolved
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'access' && (
        <div className="card mt">
          <h3>Role-Based Access Control (RBAC) Matrix</h3>
          <div className="table-wrap">
            <table className="matrix">
              <thead>
                <tr>
                  <th>Data Domain</th>
                  {roles.map((r) => <th key={r}>{r}</th>)}
                </tr>
              </thead>
              <tbody>
                {permissions.map((p) => (
                  <tr key={p.resource}>
                    <td><b>{p.resource}</b></td>
                    {p.access.map((acc, i) => (
                      <td key={i}>
                        <span className={`pill ${acc === 'Full' ? 'p-ok' : acc === 'None' ? 'p-bad' : 'p-info'}`}>
                          {acc}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'backup' && (
        <div className="grid g2 mt">
          <div className="card">
            <h3>Export System State</h3>
            <p className="muted" style={{ marginBottom: '14px' }}>
              Download the entire suite state including all employees, attendance, expenses, tickets, and configurations as JSON.
            </p>
            <button className="btn primary" onClick={handleBackupExport}>
              <Icon name="download" size={16} /> Export JSON Snapshot
            </button>
          </div>

          <div className="card">
            <h3>Reset to Factory Demonstration</h3>
            <p className="muted" style={{ marginBottom: '14px' }}>
              Restore original factory seed data. This will reload all default demonstration employees and cycles.
            </p>
            <button
              className="btn bad"
              onClick={() => {
                localStorage.removeItem('bc-hr-state')
                window.location.reload()
              }}
            >
              Reset to Factory Seed
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
