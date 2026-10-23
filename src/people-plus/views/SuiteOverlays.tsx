import React, { useState, useEffect } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'
import { avatarColor, initials, inr } from '../helpers'
import { APPS } from '../data'
import type { Employee } from '../types'

export const SuiteOverlays: React.FC = () => {
  const { drawer, closeDrawer, paletteOpen, setPaletteOpen, toastMsg, state, setActiveApp, setActiveView, openModal, logout } = usePeoplePlus()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      } else if (e.key === 'Escape') {
        setPaletteOpen(false)
        closeDrawer()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setPaletteOpen, closeDrawer])

  const actions = [
    { label: 'Apply for leave', hint: 'Leave & Attendance', run: () => openModal('applyLeave') },
    { label: 'Claim an expense', hint: 'Expense & Travel', run: () => openModal('claimExpense') },
    { label: 'Raise an HR request', hint: 'Helpdesk & Support', run: () => openModal('raiseTicket') },
    { label: 'Run payroll', hint: 'Payroll Administration', run: () => { setActiveApp('payroll'); setActiveView('payrollDash') } },
    { label: 'Add new employee', hint: 'People Operations', run: () => openModal('addEmp') },
    { label: 'View shift roster', hint: 'Shift & Schedule', run: () => { setActiveApp('shift'); setActiveView('shiftDash') } },
    { label: 'Sign out', hint: 'Session', run: logout },
  ]

  const appItems = APPS.map((a) => ({
    label: a.name,
    hint: `Open ${a.name} App`,
    run: () => { setActiveApp(a.key); setActiveView(`${a.key}Dash`) },
  }))

  const peopleItems = state.employees.map((e) => ({
    label: e.name,
    hint: `${e.role} (${e.dept})`,
    run: () => { setActiveApp('people'); setActiveView('directory') },
  }))

  const allItems = [...actions, ...appItems, ...peopleItems]
  const filteredItems = allItems
    .filter((i) => !query || (i.label + i.hint).toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10)

  const selectedEmp = drawer?.data?.emp as Employee | undefined

  return (
    <>
      {/* Toast Notification */}
      <div id="toast" className={`toast ${toastMsg ? 'on' : ''}`}>
        <Icon name="check" size={18} />
        <span>{toastMsg}</span>
      </div>

      {/* Scrim Overlay */}
      <div className={`scrim ${drawer || paletteOpen ? 'on' : ''}`} onClick={() => { closeDrawer(); setPaletteOpen(false) }} />

      {/* Command Palette */}
      <div className={`palette ${paletteOpen ? 'on' : ''}`}>
        <input
          type="search"
          placeholder="Search apps, actions, or employees... (Esc to close)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={paletteOpen}
        />
        <ul id="plist">
          {filteredItems.map((item, idx) => (
            <li
              key={idx}
              onClick={() => {
                setPaletteOpen(false)
                item.run()
              }}
            >
              <b>{item.label}</b>
              <span>{item.hint}</span>
            </li>
          ))}
          {filteredItems.length === 0 && (
            <div className="empty">No results found for “{query}”.</div>
          )}
        </ul>
      </div>

      {/* Profile Drawer */}
      <div className={`drawer ${drawer?.type === 'empProfile' ? 'on' : ''}`}>
        {selectedEmp && (
          <div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
              <div className="av lg" style={{ background: avatarColor(selectedEmp.name) }}>
                {initials(selectedEmp.name)}
              </div>
              <div>
                <h2>{selectedEmp.name}</h2>
                <div className="muted">{selectedEmp.role} · {selectedEmp.id}</div>
              </div>
            </div>

            <div style={{ margin: '14px 0' }}>
              <span className={`pill ${selectedEmp.status === 'Active' ? 'p-ok' : 'p-warn'}`}>
                {selectedEmp.status}
              </span>
            </div>

            <div className="kv-grid">
              <div className="kv">
                <dt>Department</dt>
                <dd><b>{selectedEmp.dept}</b></dd>
                <dt>Location</dt>
                <dd>{selectedEmp.loc}</dd>
                <dt>Reports to</dt>
                <dd>{selectedEmp.mgr || 'Naresh Vemparala'}</dd>
                <dt>Joined date</dt>
                <dd>{selectedEmp.joined}</dd>
                <dt>Shift type</dt>
                <dd>{selectedEmp.shift}</dd>
                <dt>Work email</dt>
                <dd>{selectedEmp.email || `${selectedEmp.name.toLowerCase().replace(/ /g, '.')}@brightcone.ai`}</dd>
                <dt>Phone</dt>
                <dd>{selectedEmp.phone}</dd>
                <dt>Annual CTC</dt>
                <dd><b>{inr(selectedEmp.ctc)}</b></dd>
                <dt>Grade</dt>
                <dd><span className="pill p-info">{selectedEmp.grade}</span></dd>
              </div>
            </div>

            <h3 style={{ fontSize: '15px', margin: '24px 0 10px' }}>Personal & Banking Details</h3>
            <div className="kv">
              <dt>Permanent Address</dt>
              <dd>{selectedEmp.address || 'Hyderabad, Telangana 500084'}</dd>
              <dt>Emergency Contact</dt>
              <dd>{selectedEmp.emergency || 'Family Contact, +91 98490 22110'}</dd>
              <dt>Blood Group</dt>
              <dd>{selectedEmp.blood || 'B+'}</dd>
              <dt>PAN Number</dt>
              <dd>{selectedEmp.pan || 'ABCPV••••K'}</dd>
              <dt>Salary Bank</dt>
              <dd>{selectedEmp.bank || 'HDFC Bank ••4821'}</dd>
            </div>

            <div className="mfoot" style={{ marginTop: '24px', justifyContent: 'flex-start' }}>
              <button className="btn primary" onClick={closeDrawer}>Close Profile</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
