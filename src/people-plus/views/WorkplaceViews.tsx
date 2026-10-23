import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'
import { avatarColor, initials } from '../helpers'

export const WorkplaceViews: React.FC = () => {
  const { state, openModal, toast } = usePeoplePlus()
  const [tab, setTab] = useState<'docs' | 'assets' | 'tickets'>('docs')

  const handleAcknowledge = (policyName: string) => {
    toast(`Policy "${policyName}" acknowledged and recorded in audit log.`)
  }

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Workplace & Service</div>
          <h1>Workplace & Helpdesk</h1>
          <p>Company policies and handbooks, IT asset allocations, and employee service tickets.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => openModal('raiseTicket')}>
            <Icon name="plus" size={16} /> Raise HR ticket
          </button>
        </div>
      </div>

      <div className="tabs mb">
        <button className={tab === 'docs' ? 'on' : ''} onClick={() => setTab('docs')}>
          Policies & handbook ({state.policies.length})
        </button>
        <button className={tab === 'assets' ? 'on' : ''} onClick={() => setTab('assets')}>
          Assets & devices ({state.assets.length})
        </button>
        <button className={tab === 'tickets' ? 'on' : ''} onClick={() => setTab('tickets')}>
          Support tickets ({state.tickets.length})
        </button>
      </div>

      {tab === 'docs' && (
        <div className="card mt">
          <h3>Company Policies & Employee Handbook</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Policy Name</th>
                  <th>Version</th>
                  <th>Effective Date</th>
                  <th>Mandatory</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {state.policies.map((p) => (
                  <tr key={p.id}>
                    <td><b>{p.n}</b></td>
                    <td><span className="pill p-info">v{p.v}</span></td>
                    <td>{p.d}</td>
                    <td>
                      <span className={`pill ${p.mand ? 'p-bad' : 'p-mute'}`}>
                        {p.mand ? 'Mandatory' : 'Optional'}
                      </span>
                    </td>
                    <td><span className="pill p-ok">Published</span></td>
                    <td>
                      <button className="btn sm primary" onClick={() => handleAcknowledge(p.n)}>
                        Acknowledge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'assets' && (
        <div className="card mt">
          <h3>Assigned Hardware & IT Inventory</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Asset Tag</th>
                  <th>Device Type</th>
                  <th>Model</th>
                  <th>Assigned To</th>
                  <th>Assigned Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.assets.map((a) => (
                  <tr key={a.tag}>
                    <td><span className="muted">{a.tag}</span></td>
                    <td><b>{a.type}</b></td>
                    <td>{a.model}</td>
                    <td>
                      {a.emp ? (
                        <div className="who">
                          <div className="av" style={{ background: avatarColor(a.emp) }}>{initials(a.emp)}</div>
                          <b>{a.emp}</b>
                        </div>
                      ) : (
                        <span className="muted">In Inventory</span>
                      )}
                    </td>
                    <td>{a.since || '—'}</td>
                    <td>
                      <span className={`pill ${a.status === 'Assigned' ? 'p-ok' : a.status === 'In stock' ? 'p-info' : 'p-warn'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'tickets' && (
        <div className="card mt">
          <h3>Employee Helpdesk Queue</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Requester</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {state.tickets.map((t) => (
                  <tr key={t.id}>
                    <td><span className="muted">{t.id}</span></td>
                    <td><b>{t.sub}</b></td>
                    <td>{t.emp}</td>
                    <td><span className="pill p-info">{t.cat}</span></td>
                    <td>
                      <span className={`pill ${t.pri === 'High' ? 'p-bad' : 'p-mute'}`}>
                        {t.pri}
                      </span>
                    </td>
                    <td>
                      <span className={`pill ${t.status === 'Resolved' ? 'p-ok' : t.status === 'In progress' ? 'p-info' : 'p-warn'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>{t.to || 'Unassigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
