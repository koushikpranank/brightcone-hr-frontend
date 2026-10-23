import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import type { Employee } from '../types'

export const SuiteModals: React.FC = () => {
  const { modal, closeModal, applyLeave, claimExpense, raiseTicket, addEmployee, user, state, toast } = usePeoplePlus()

  // Apply Leave form state
  const [leaveType, setLeaveType] = useState('Earned leave')
  const [leaveFrom, setLeaveFrom] = useState(new Date().toISOString().slice(0, 10))
  const [leaveTo, setLeaveTo] = useState(new Date().toISOString().slice(0, 10))
  const [leaveDays, setLeaveDays] = useState(1)
  const [leaveReason, setLeaveReason] = useState('')

  // Claim Expense form state
  const [expCat, setExpCat] = useState('Internet')
  const [expAmt, setExpAmt] = useState(1500)
  const [expDate, setExpDate] = useState(new Date().toISOString().slice(0, 10))
  const [expDesc, setExpDesc] = useState('')

  // Raise Ticket form state
  const [ticketSub, setTicketSub] = useState('')
  const [ticketCat, setTicketCat] = useState('Payroll & tax')
  const [ticketPri, setTicketPri] = useState<'Normal' | 'High'>('Normal')

  // Add Employee form state
  const [empName, setEmpName] = useState('')
  const [empRole, setEmpRole] = useState('')
  const [empDept, setEmpDept] = useState('Engineering')
  const [empLoc, setEmpLoc] = useState('Hyderabad')
  const [empCtc, setEmpCtc] = useState(2400000)

  if (!modal) return null

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyLeave({
      emp: user?.name || 'Rahul Varma',
      type: leaveType,
      from: leaveFrom,
      to: leaveTo,
      days: Number(leaveDays),
      reason: leaveReason || 'Personal',
    })
    closeModal()
  }

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    claimExpense({
      emp: user?.name || 'Rahul Varma',
      cat: expCat,
      amt: Number(expAmt),
      date: expDate,
      desc: expDesc || 'Expense claim',
    })
    closeModal()
  }

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    raiseTicket({
      emp: user?.name || 'Rahul Varma',
      sub: ticketSub || 'Helpdesk request',
      cat: ticketCat,
      pri: ticketPri,
      to: '',
    })
    closeModal()
  }

  const handleAddEmpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextId = 'BC-' + Math.floor(1080 + Math.random() * 900)
    const newEmp: Employee = {
      id: nextId,
      name: empName,
      role: empRole,
      dept: empDept,
      loc: empLoc,
      status: 'Probation',
      joined: new Date().toISOString().slice(0, 10),
      mgr: 'Priya Menon',
      ctc: Number(empCtc),
      phone: '+91 98480 99999',
      shift: 'General',
      grade: 'L4',
    }
    addEmployee(newEmp)
    closeModal()
  }

  return (
    <>
      <div className="scrim on" onClick={closeModal} />
      <div className="modal on">
        {modal.type === 'applyLeave' && (
          <form onSubmit={handleLeaveSubmit}>
            <h2>Apply for Leave</h2>
            <p className="sub">Submit your time off request for manager approval.</p>

            <div className="field">
              <span>Leave Type</span>
              <select className="input" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                {state.leaveTypes.map((t) => (
                  <option key={t.n} value={t.n}>{t.n} ({t.q} days annual quota)</option>
                ))}
              </select>
            </div>

            <div className="frow">
              <div className="field">
                <span>Start Date</span>
                <input className="input" type="date" value={leaveFrom} onChange={(e) => setLeaveFrom(e.target.value)} required />
              </div>
              <div className="field">
                <span>End Date</span>
                <input className="input" type="date" value={leaveTo} onChange={(e) => setLeaveTo(e.target.value)} required />
              </div>
            </div>

            <div className="field">
              <span>Number of Days</span>
              <input className="input" type="number" min="0.5" step="0.5" value={leaveDays} onChange={(e) => setLeaveDays(Number(e.target.value))} required />
            </div>

            <div className="field">
              <span>Reason</span>
              <textarea className="input" rows={2} placeholder="Brief reason for time off..." value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} required />
            </div>

            <div className="mfoot">
              <button type="button" className="btn" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn primary">Submit Leave Application</button>
            </div>
          </form>
        )}

        {modal.type === 'claimExpense' && (
          <form onSubmit={handleExpenseSubmit}>
            <h2>Claim Expense Reimbursement</h2>
            <p className="sub">Submit business expenses and attaching invoice details.</p>

            <div className="field">
              <span>Category</span>
              <select className="input" value={expCat} onChange={(e) => setExpCat(e.target.value)}>
                <option value="Travel">Travel & Lodging</option>
                <option value="Meals">Team Meals & Entertainment</option>
                <option value="Internet">Home Broadband / Mobile</option>
                <option value="Equipment">Peripherals & Hardware</option>
                <option value="Books">Books & Learning Materials</option>
              </select>
            </div>

            <div className="frow">
              <div className="field">
                <span>Amount (INR)</span>
                <input className="input" type="number" min="1" value={expAmt} onChange={(e) => setExpAmt(Number(e.target.value))} required />
              </div>
              <div className="field">
                <span>Expense Date</span>
                <input className="input" type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} required />
              </div>
            </div>

            <div className="field">
              <span>Description & Business Purpose</span>
              <textarea className="input" rows={2} placeholder="Purpose of this expense..." value={expDesc} onChange={(e) => setExpDesc(e.target.value)} required />
            </div>

            <div className="mfoot">
              <button type="button" className="btn" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn primary">Submit Claim</button>
            </div>
          </form>
        )}

        {modal.type === 'raiseTicket' && (
          <form onSubmit={handleTicketSubmit}>
            <h2>Raise HR Helpdesk Ticket</h2>
            <p className="sub">Request assistance with payroll, letters, insurance, or workplace services.</p>

            <div className="field">
              <span>Subject</span>
              <input className="input" placeholder="e.g. Need address verification letter" value={ticketSub} onChange={(e) => setTicketSub(e.target.value)} required />
            </div>

            <div className="frow">
              <div className="field">
                <span>Category</span>
                <select className="input" value={ticketCat} onChange={(e) => setTicketCat(e.target.value)}>
                  <option value="Payroll & tax">Payroll & Tax</option>
                  <option value="Letters & documents">Letters & Documents</option>
                  <option value="Benefits & insurance">Benefits & Insurance</option>
                  <option value="IT & Assets">IT & Workplace Assets</option>
                </select>
              </div>
              <div className="field">
                <span>Priority</span>
                <select className="input" value={ticketPri} onChange={(e) => setTicketPri(e.target.value as 'Normal' | 'High')}>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="mfoot">
              <button type="button" className="btn" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn primary">Create Ticket</button>
            </div>
          </form>
        )}

        {modal.type === 'addEmp' && (
          <form onSubmit={handleAddEmpSubmit}>
            <h2>Add New Employee</h2>
            <p className="sub">Create a new employee profile in Brightcone master data.</p>

            <div className="frow">
              <div className="field">
                <span>Full Name</span>
                <input className="input" placeholder="e.g. Sravan Kumar" value={empName} onChange={(e) => setEmpName(e.target.value)} required />
              </div>
              <div className="field">
                <span>Job Role</span>
                <input className="input" placeholder="e.g. Frontend Engineer" value={empRole} onChange={(e) => setEmpRole(e.target.value)} required />
              </div>
            </div>

            <div className="frow">
              <div className="field">
                <span>Department</span>
                <select className="input" value={empDept} onChange={(e) => setEmpDept(e.target.value)}>
                  {state.depts.map((d) => <option key={d.n} value={d.n}>{d.n}</option>)}
                </select>
              </div>
              <div className="field">
                <span>Location</span>
                <select className="input" value={empLoc} onChange={(e) => setEmpLoc(e.target.value)}>
                  {state.locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>

            <div className="field">
              <span>Annual CTC (INR)</span>
              <input className="input" type="number" min="300000" step="50000" value={empCtc} onChange={(e) => setEmpCtc(Number(e.target.value))} required />
            </div>

            <div className="mfoot">
              <button type="button" className="btn" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn primary">Add to Directory</button>
            </div>
          </form>
        )}

        {modal.type === 'requestSwap' && (
          <div>
            <h2>Request Shift Swap</h2>
            <p className="sub">Select a teammate to swap shifts for coverage.</p>
            <div className="field">
              <span>Date</span>
              <input className="input" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="field">
              <span>Teammate to Swap With</span>
              <select className="input">
                {state.employees.map((e) => (
                  <option key={e.id} value={e.name}>{e.name} ({e.shift})</option>
                ))}
              </select>
            </div>
            <div className="mfoot">
              <button className="btn" onClick={closeModal}>Cancel</button>
              <button className="btn primary" onClick={() => { closeModal(); toast('Shift swap request sent!') }}>Send Request</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
