import React, { useState } from 'react'
import { useEmployees, useReferences } from '@/features/people/api'
import { useRules, useRuleMetrics } from '@/features/advanced-hr/api'
import { useAuth } from '@/auth/useAuth'
import { Icon } from '../Icon'

export const AdvancedHrViews: React.FC = () => {
  const { can } = useAuth()
  const allowed = can('people:manage') || can('users:manage')
  const employees = useEmployees(allowed)
  const departments = useReferences('departments', allowed)
  const locations = useReferences('locations', allowed)
  const rules = useRules(allowed)
  const metrics = useRuleMetrics(allowed)

  const [tab, setTab] = useState<'analytics' | 'compliance'>('analytics')

  const empList = employees.data ?? []
  const deptList = departments.data ?? []
  const locList = locations.data ?? []
  const ruleList = rules.data ?? []
  const m = metrics.data

  const totalEmployees = empList.length
  const probationCount = empList.filter((e) => e.status === 'probation').length
  const noticeCount = empList.filter((e) => e.status === 'notice_period').length

  if (employees.isLoading) {
    return <div className="loader">Loading workforce data…</div>
  }

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Advanced HR Operations</div>
          <h1>Workforce Analytics & Governance</h1>
          <p>Workforce planning metrics and statutory compliance scorecards.</p>
        </div>
      </div>

      <div className="tabs mb">
        <button className={tab === 'analytics' ? 'on' : ''} onClick={() => setTab('analytics')}>
          Workforce analytics
        </button>
        <button className={tab === 'compliance' ? 'on' : ''} onClick={() => setTab('compliance')}>
          Rule engine & compliance
        </button>
      </div>

      {tab === 'analytics' && (
        <>
          <div className="grid g4 mt">
            <div className="card stat">
              <div className="k"><i><Icon name="users" size={16} /></i> Active Workforce</div>
              <div className="v">{totalEmployees}</div>
              <div className="d">Live from People API</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="clock" size={16} /></i> On Probation</div>
              <div className="v">{probationCount}</div>
              <div className="d">Filtered by status</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="swap" size={16} /></i> Serving Notice</div>
              <div className="v">{noticeCount}</div>
              <div className="d">Planned transitions</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="chart" size={16} /></i> Departments</div>
              <div className="v">{deptList.length}</div>
              <div className="d">Active departments</div>
            </div>
          </div>

          <div className="grid g2 mt">
            <div className="card">
              <h3>Department Distribution</h3>
              <div className="dept-bars wide" style={{ marginTop: 14 }}>
                {deptList.map((d) => {
                  const count = empList.filter((e) => e.department_id === d.id).length
                  const pct = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0
                  return (
                    <div key={d.id} className="r">
                      <span>{d.label}</span>
                      <div className="bar"><span style={{ width: `${pct}%` }} /></div>
                      <em>{count} ({pct}%)</em>
                    </div>
                  )
                })}
                {deptList.length === 0 && (
                  <p className="muted">No departments configured yet.</p>
                )}
              </div>
            </div>

            <div className="card">
              <h3>Location Distribution</h3>
              <div className="dept-bars wide" style={{ marginTop: 14 }}>
                {locList.map((loc) => {
                  const count = empList.filter((e) => e.location_id === loc.id).length
                  const pct = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0
                  return (
                    <div key={loc.id} className="r">
                      <span>{loc.label}</span>
                      <div className="bar"><span style={{ width: `${pct}%` }} /></div>
                      <em>{count}</em>
                    </div>
                  )
                })}
                {locList.length === 0 && (
                  <p className="muted">No locations configured yet.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'compliance' && (
        <div className="card mt">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3>Automation Rules & Metrics</h3>
              <span className="muted">Rule engine status from the connected backend</span>
            </div>
            {m && (
              <div style={{ display: 'flex', gap: 12 }}>
                <span className="pill p-ok">{m.complete} complete</span>
                <span className="pill p-warn">{m.pending} pending</span>
                <span className="pill p-bad">{m.failed} failed</span>
              </div>
            )}
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rule</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ruleList.map((r) => (
                  <tr key={r.rule_key}>
                    <td><b>{r.rule_key.replace(/_/g, ' ')}</b></td>
                    <td>
                      <span className={`pill ${r.enabled ? 'p-ok' : 'p-bad'}`}>
                        {r.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
                {ruleList.length === 0 && (
                  <tr><td colSpan={2} className="muted" style={{ textAlign: 'center' }}>
                    No rules configured — rules will appear as they are added via the API.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
