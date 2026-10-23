import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'
import { avatarColor, initials } from '../helpers'

export const PeopleViews: React.FC = () => {
  const { state, openModal, openDrawer } = usePeoplePlus()
  const [tab, setTab] = useState<'directory' | 'org' | 'onboard' | 'exits'>('directory')
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')

  const departments = ['All', ...state.depts.map((d) => d.n)]

  const filteredEmployees = state.employees.filter((e) => {
    const matchesSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase())
    const matchesDept = deptFilter === 'All' || e.dept === deptFilter
    return matchesSearch && matchesDept
  })

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">People App</div>
          <h1>People & Organization</h1>
          <p>Manage employee records, organizational hierarchy, onboarding checklists, and offboarding.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => openModal('addEmp')}>
            <Icon name="plus" size={16} /> Add employee
          </button>
        </div>
      </div>

      <div className="tabs mb">
        <button className={tab === 'directory' ? 'on' : ''} onClick={() => setTab('directory')}>
          Directory ({state.employees.length})
        </button>
        <button className={tab === 'org' ? 'on' : ''} onClick={() => setTab('org')}>
          Org structure
        </button>
        <button className={tab === 'onboard' ? 'on' : ''} onClick={() => setTab('onboard')}>
          Onboarding ({state.onboard.length})
        </button>
        <button className={tab === 'exits' ? 'on' : ''} onClick={() => setTab('exits')}>
          Exits ({state.resignations.length})
        </button>
      </div>

      {tab === 'directory' && (
        <div className="card mt">
          <div className="toolbar">
            <div className="search">
              <Icon name="search" size={16} />
              <input
                className="input"
                type="search"
                placeholder="Search employees by name, role or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
              ))}
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Manager</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="click" onClick={() => openDrawer('empProfile', { emp })}>
                    <td>
                      <div className="who">
                        <div className="av" style={{ background: avatarColor(emp.name) }}>
                          {initials(emp.name)}
                        </div>
                        <div>
                          <b>{emp.name}</b>
                          <span>{emp.role}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="muted">{emp.id}</span></td>
                    <td>{emp.dept}</td>
                    <td>{emp.loc}</td>
                    <td>{emp.mgr || '—'}</td>
                    <td><span className="pill p-info">{emp.grade}</span></td>
                    <td>
                      <span className={`pill ${emp.status === 'Active' ? 'p-ok' : emp.status === 'Probation' ? 'p-warn' : 'p-bad'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button className="btn sm ib" title="View details" onClick={() => openDrawer('empProfile', { emp })}>
                        <Icon name="eye" size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'org' && (
        <div className="card mt">
          <h3>Reporting Hierarchy</h3>
          <p className="muted" style={{ marginBottom: '16px' }}>Interactive leadership tree down to individual contributors.</p>
          <div className="org">
            <div className="node" style={{ marginBottom: '12px' }}>
              <div className="av" style={{ background: avatarColor('Naresh Vemparala') }}>NV</div>
              <div>
                <b>Naresh Vemparala</b>
                <span>Founder & CEO · Executive Leadership</span>
              </div>
            </div>
            <ul>
              {state.depts.filter((d) => d.head !== 'Naresh Vemparala').map((d) => (
                <li key={d.n}>
                  <div className="node">
                    <div className="av" style={{ background: avatarColor(d.head) }}>{initials(d.head)}</div>
                    <div>
                      <b>{d.head}</b>
                      <span>Head of {d.n} · {d.cc}</span>
                    </div>
                  </div>
                  <ul>
                    {state.employees.filter((e) => e.mgr === d.head).map((sub) => (
                      <li key={sub.id}>
                        <div className="node">
                          <div className="av" style={{ background: avatarColor(sub.name) }}>{initials(sub.name)}</div>
                          <div>
                            <b>{sub.name}</b>
                            <span>{sub.role} ({sub.loc})</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === 'onboard' && (
        <div className="grid g2 mt">
          {state.onboard.map((ob) => {
            const emp = state.employees.find((e) => e.name === ob.emp)
            const completedCount = ob.tasks.filter((t) => t[1] === 1).length
            const pct = Math.round((completedCount / ob.tasks.length) * 100)
            return (
              <div key={ob.emp} className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div className="who">
                    <div className="av" style={{ background: avatarColor(ob.emp) }}>{initials(ob.emp)}</div>
                    <div>
                      <b>{ob.emp}</b>
                      <span>{emp?.role || 'New Hire'} · Joined {emp?.joined}</span>
                    </div>
                  </div>
                  <span className="pill p-info">{pct}% Ready</span>
                </div>
                <div className="bar" style={{ marginBottom: '14px' }}>
                  <span style={{ width: `${pct}%` }} />
                </div>
                <div className="list">
                  {ob.tasks.map(([task, done], idx) => (
                    <label key={idx} className={`check ${done ? 'done' : ''}`}>
                      <input type="checkbox" defaultChecked={done === 1} disabled />
                      <span>{task}</span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'exits' && (
        <div className="card mt">
          <h3>Resignations & Offboarding Pipeline</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Notice Date</th>
                  <th>Last Working Day</th>
                  <th>Reason</th>
                  <th>Exit Tasks</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.resignations.map((r) => {
                  const checkList = r.check ?? []
                  const doneTasks = checkList.filter((c) => c[1] === 1).length
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className="who">
                          <div className="av" style={{ background: avatarColor(r.emp) }}>{initials(r.emp)}</div>
                          <div><b>{r.emp}</b><span>ID: {r.id}</span></div>
                        </div>
                      </td>
                      <td>{r.date}</td>
                      <td><b>{r.lwd}</b></td>
                      <td>{r.reason}</td>
                      <td>{doneTasks} of {checkList.length} tasks clear</td>
                      <td><span className="pill p-warn">{r.status}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
