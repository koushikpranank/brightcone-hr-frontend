import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'

export const SignViews: React.FC = () => {
  const { state, user, signDoc, toast } = usePeoplePlus()
  const [tab, setTab] = useState<'envelopes' | 'viewer' | 'templates'>('envelopes')
  const [selectedDoc, setSelectedDoc] = useState(state.sign[0])

  const pendingCount = state.sign.filter((s) => s.status === 'Awaiting signature').length

  const handleOpenViewer = (doc: typeof state.sign[0]) => {
    setSelectedDoc(doc)
    setTab('viewer')
  }

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Sign & Compliance</div>
          <h1>E-Signature & Documents</h1>
          <p>Send digital employment contracts, collect legally binding e-signatures, and manage templates.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => toast('Select a template below to prepare a new envelope.')}>
            <Icon name="plus" size={16} /> New envelope
          </button>
        </div>
      </div>

      <div className="tabs mb">
        <button className={tab === 'envelopes' ? 'on' : ''} onClick={() => setTab('envelopes')}>
          Envelopes ({state.sign.length})
        </button>
        <button className={tab === 'viewer' ? 'on' : ''} onClick={() => setTab('viewer')}>
          Document signer
        </button>
        <button className={tab === 'templates' ? 'on' : ''} onClick={() => setTab('templates')}>
          Templates ({state.signTpls.length})
        </button>
      </div>

      {tab === 'envelopes' && (
        <div className="card mt">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3>Document Envelopes</h3>
            <span className="pill p-warn">{pendingCount} Awaiting signature</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Envelope ID</th>
                  <th>Document Title</th>
                  <th>Recipient</th>
                  <th>Sent By</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.sign.map((doc) => (
                  <tr key={doc.id}>
                    <td><span className="muted">{doc.id}</span></td>
                    <td><b>{doc.doc}</b></td>
                    <td>{doc.to}</td>
                    <td>{doc.from}</td>
                    <td>{doc.due}</td>
                    <td>
                      <span className={`pill ${doc.status === 'Completed' ? 'p-ok' : doc.status === 'Declined' ? 'p-bad' : 'p-warn'}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn sm primary" onClick={() => handleOpenViewer(doc)}>
                        {doc.status === 'Completed' ? 'View audit' : 'Review & Sign'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'viewer' && selectedDoc && (
        <div className="grid g-dash mt">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3>{selectedDoc.doc}</h3>
                <span className="muted">Envelope ID: {selectedDoc.id} · Recipient: {selectedDoc.to}</span>
              </div>
              <span className={`pill ${selectedDoc.status === 'Completed' ? 'p-ok' : 'p-warn'}`}>
                {selectedDoc.status}
              </span>
            </div>

            <div className="docprev">
              <p><b>CONFIDENTIAL EMPLOYMENT & INTELLECTUAL PROPERTY ACKNOWLEDGEMENT</b></p>
              <p>This document confirms the terms and conditions agreed between Brightcone, Inc. and <b>{selectedDoc.to}</b>. By affixing digital signature below, the recipient acknowledges receipt, agreement to company policies, non-disclosure requirements, and assignment of inventions.</p>
              <div className="lines">
                <i /><i /><i /><i style={{ width: '60%' }} />
              </div>
            </div>

            <div className="sigbox">
              <span>{selectedDoc.status === 'Completed' ? selectedDoc.to : user?.name || selectedDoc.to}</span>
              <small>Digital Signature · Cryptographically Verified Timestamp: {selectedDoc.signed || 'Pending Verification'}</small>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              {selectedDoc.status !== 'Completed' ? (
                <button className="btn primary" onClick={() => signDoc(selectedDoc.id)}>
                  <Icon name="check" size={16} /> Sign & Complete Envelope
                </button>
              ) : (
                <button className="btn ok" onClick={() => toast('Certificate of completion verified.')}>
                  <Icon name="check" size={16} /> Signed on {selectedDoc.signed}
                </button>
              )}
              <button className="btn" onClick={() => setTab('envelopes')}>Back to list</button>
            </div>
          </div>

          <div className="card">
            <h3>Envelope Metadata</h3>
            <div className="kv" style={{ marginTop: '14px' }}>
              <dt>Created By</dt>
              <dd><b>{selectedDoc.from}</b></dd>
              <dt>Recipient</dt>
              <dd>{selectedDoc.to}</dd>
              <dt>Sent Date</dt>
              <dd>{selectedDoc.sent}</dd>
              <dt>Expiration</dt>
              <dd>{selectedDoc.due}</dd>
              <dt>Security</dt>
              <dd><span className="pill p-ok">SHA-256 Tamper-evident</span></dd>
            </div>
          </div>
        </div>
      )}

      {tab === 'templates' && (
        <div className="tplgrid mt">
          {state.signTpls.map((tpl) => (
            <div key={tpl.n} className="card">
              <div className="tplprev">
                <i /><i /><i style={{ width: '40%' }} />
                <em>{tpl.f} signature fields</em>
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>{tpl.n}</h3>
              <p className="muted" style={{ fontSize: '13px', marginBottom: '14px' }}>
                Used {tpl.used} times across departments
              </p>
              <button className="btn sm primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => toast(`Created new draft using ${tpl.n} template`)}>
                Use template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
