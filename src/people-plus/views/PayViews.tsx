import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'
import { inr, salary, avatarColor, initials } from '../helpers'

export const PayViews: React.FC = () => {
  const { state, user, advancePayroll, toast } = usePeoplePlus()
  const [tab, setTab] = useState<'run' | 'payslips' | 'register' | 'benefits'>('run')

  const currentEmp = state.employees.find((e) => e.name === (user?.name || 'Rahul Varma')) || state.employees[0]
  const sal = salary(currentEmp)

  const steps = [
    'Lock attendance & leaves',
    'Review salary revisions',
    'Process expense payouts',
    'Calculate TDS & statutory',
    'Publish payslips & bank files',
  ]

  const currentStep = state.payroll.step

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Payroll & Tax</div>
          <h1>Payroll Management</h1>
          <p>End-to-end payroll processing, statutory deductions, monthly salary registers, and digital payslips.</p>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => toast('Bank NEFT/RTGS payment file generated!')}>
            <Icon name="download" size={16} /> Download bank payout file
          </button>
          <button className="btn primary" onClick={advancePayroll}>
            <Icon name="pay" size={16} /> {currentStep >= 5 ? 'Start next payroll cycle' : 'Advance payroll step'}
          </button>
        </div>
      </div>

      <div className="tabs mb">
        <button className={tab === 'run' ? 'on' : ''} onClick={() => setTab('run')}>
          Run payroll ({state.payroll.month})
        </button>
        <button className={tab === 'payslips' ? 'on' : ''} onClick={() => setTab('payslips')}>
          My payslip & tax
        </button>
        <button className={tab === 'register' ? 'on' : ''} onClick={() => setTab('register')}>
          Salary register
        </button>
        <button className={tab === 'benefits' ? 'on' : ''} onClick={() => setTab('benefits')}>
          Benefits & Insurance ({state.plans.length})
        </button>
      </div>

      {tab === 'run' && (
        <>
          <div className="card mt">
            <h3>{state.payroll.month} Processing Stepper</h3>
            <p className="muted" style={{ marginBottom: '20px' }}>
              Complete all five validation steps to publish payslips and disburse salaries.
            </p>
            <div className="stepper">
              {steps.map((st, i) => (
                <div key={i} className={`step ${i < currentStep ? 'done' : i === currentStep ? 'cur' : ''}`}>
                  <div className="n">{i < currentStep ? '✓' : i + 1}</div>
                  <div>
                    <b style={{ fontSize: '13.5px' }}>{st}</b>
                    <span className="muted" style={{ fontSize: '12px', display: 'block' }}>
                      {i < currentStep ? 'Completed' : i === currentStep ? 'In progress' : 'Upcoming'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
              <button className="btn primary" onClick={advancePayroll}>
                {currentStep >= 4 ? 'Publish all payslips' : 'Approve & continue to next step'}
              </button>
            </div>
          </div>

          <div className="grid g3 mt">
            <div className="card stat">
              <div className="k"><i><Icon name="pay" size={16} /></i> Estimated Gross</div>
              <div className="v">{inr(state.employees.reduce((a, e) => a + e.ctc / 12, 0))}</div>
              <div className="d">For {state.employees.length} active employees</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="receipt" size={16} /></i> Variable Payouts</div>
              <div className="v">{inr(state.payroll.inputs.reduce((a, x) => a + x.amt, 0))}</div>
              <div className="d">{state.payroll.inputs.length} bonus / claims pending</div>
            </div>
            <div className="card stat">
              <div className="k"><i><Icon name="shield" size={16} /></i> Statutory EPF / ESI</div>
              <div className="v">{inr(state.employees.reduce((a, e) => a + salary(e).pfE, 0))}</div>
              <div className="d up">100% compliant</div>
            </div>
          </div>
        </>
      )}

      {tab === 'payslips' && (
        <div className="grid g2 mt">
          <div className="card">
            <h3>Earnings & Allowances</h3>
            <div className="list">
              {sal.earn.map(([name, amt]) => (
                <div key={name} className="row">
                  <div className="grow"><b>{name}</b></div>
                  <div>{inr(amt)}</div>
                </div>
              ))}
              <div className="row" style={{ fontWeight: 700, borderTop: '2px solid var(--line)' }}>
                <div className="grow">Total Gross Salary</div>
                <div style={{ color: 'var(--brand)' }}>{inr(sal.gross)}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Deductions & Statutory Contributions</h3>
            <div className="list">
              {sal.ded.map(([name, amt]) => (
                <div key={name} className="row">
                  <div className="grow"><b>{name}</b></div>
                  <div style={{ color: 'var(--bad)' }}>- {inr(amt)}</div>
                </div>
              ))}
              <div className="row" style={{ fontWeight: 700, borderTop: '2px solid var(--line)' }}>
                <div className="grow">Net Monthly Take-Home</div>
                <div style={{ color: 'var(--ok)', fontSize: '18px' }}>{inr(sal.net)}</div>
              </div>
            </div>
            <button className="btn primary sm" style={{ marginTop: '16px' }} onClick={() => toast('PDF payslip generated and downloaded!')}>
              <Icon name="download" size={14} /> Download PDF payslip
            </button>
          </div>
        </div>
      )}

      {tab === 'register' && (
        <div className="card mt">
          <h3>Employee Salary Register</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Annual CTC</th>
                  <th>Monthly Gross</th>
                  <th>Provident Fund</th>
                  <th>Net Pay</th>
                </tr>
              </thead>
              <tbody>
                {state.employees.map((e) => {
                  const s = salary(e)
                  return (
                    <tr key={e.id}>
                      <td>
                        <div className="who">
                          <div className="av" style={{ background: avatarColor(e.name) }}>{initials(e.name)}</div>
                          <div><b>{e.name}</b><span>{e.id}</span></div>
                        </div>
                      </td>
                      <td>{e.dept}</td>
                      <td><b>{inr(e.ctc)}</b></td>
                      <td>{inr(s.gross)}</td>
                      <td>{inr(s.pfE)}</td>
                      <td><span style={{ fontWeight: 600, color: 'var(--ok)' }}>{inr(s.net)}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'benefits' && (
        <div className="grid g2 mt">
          {state.plans.map((p) => (
            <div key={p.n} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3>{p.n}</h3>
                <span className="pill p-ok">Enrolled</span>
              </div>
              <div className="kv" style={{ marginTop: '10px' }}>
                <dt>Provider</dt>
                <dd><b>{p.prov}</b></dd>
                <dt>Coverage</dt>
                <dd>{p.cover}</dd>
                <dt>Premium</dt>
                <dd><span className="pill p-info">{p.cost}</span></dd>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
