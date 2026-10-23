import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'
import { inr, avatarColor, initials } from '../helpers'
import type { Candidate } from '../types'

export const RecruitViews: React.FC = () => {
  const { state, openModal, advanceCand, toast } = usePeoplePlus()
  const [tab, setTab] = useState<'pipeline' | 'jobs' | 'interviews'>('pipeline')

  const stages: Candidate['s'][] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired']

  const handleConvert = (candName: string) => {
    toast(`Candidate ${candName} converted to employee! Onboarding checklist created.`)
  }

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Recruitment & ATS</div>
          <h1>Recruit & Applicant Tracking</h1>
          <p>AI-screened candidate pipeline, interview scheduling, and offer-to-hire conversions.</p>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => toast('Interview invite generated with calendar link')}>
            <Icon name="calendar" size={16} /> Schedule interview
          </button>
          <button className="btn primary" onClick={() => openModal('postJob')}>
            <Icon name="plus" size={16} /> Post a job
          </button>
        </div>
      </div>

      <div className="tabs mb">
        <button className={tab === 'pipeline' ? 'on' : ''} onClick={() => setTab('pipeline')}>
          ATS pipeline ({state.cands.length})
        </button>
        <button className={tab === 'jobs' ? 'on' : ''} onClick={() => setTab('jobs')}>
          Open positions ({state.jobs.length})
        </button>
        <button className={tab === 'interviews' ? 'on' : ''} onClick={() => setTab('interviews')}>
          Interviews ({state.interviews.length})
        </button>
      </div>

      {tab === 'pipeline' && (
        <div className="card mt" style={{ overflow: 'hidden' }}>
          <div className="kanban">
            {stages.map((stage) => {
              const candsInStage = state.cands.filter((c) => c.s === stage)
              const nextStage = stages[stages.indexOf(stage) + 1]
              return (
                <div key={stage} className="col">
                  <h4>
                    {stage} <span>{candsInStage.length}</span>
                  </h4>
                  {candsInStage.map((cand) => {
                    const job = state.jobs.find((j) => j.id === cand.job)
                    return (
                      <div key={cand.id} className="kc">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <b>{cand.n}</b>
                          <span className="score" title="AI match score">{cand.sc}%</span>
                        </div>
                        <div className="role">{job?.t || 'Engineering Role'} · {cand.src}</div>
                        <div className="ft">
                          {nextStage ? (
                            <button className="btn sm primary" onClick={() => advanceCand(cand.id, nextStage)}>
                              Move to {nextStage}
                            </button>
                          ) : (
                            <button className="btn sm ok" onClick={() => handleConvert(cand.n)}>
                              Convert to Hire
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'jobs' && (
        <div className="card mt">
          <h3>Active Job Postings</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Referral Bonus</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.jobs.map((j) => (
                  <tr key={j.id}>
                    <td><b>{j.t}</b></td>
                    <td>{j.dept}</td>
                    <td>{j.loc}</td>
                    <td>{j.type}</td>
                    <td><span className="pill p-ok">{inr(j.bonus || 0)}</span></td>
                    <td><span className="pill p-info">{j.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'interviews' && (
        <div className="card mt">
          <h3>Scheduled Interview Rounds</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Round</th>
                  <th>Scheduled Time</th>
                  <th>Interview Panel</th>
                </tr>
              </thead>
              <tbody>
                {state.interviews.map((iv) => {
                  const cand = state.cands.find((c) => c.id === iv.cand)
                  return (
                    <tr key={iv.id}>
                      <td>
                        <div className="who">
                          <div className="av" style={{ background: avatarColor(cand?.n || 'Candidate') }}>
                            {initials(cand?.n || 'C')}
                          </div>
                          <b>{cand?.n || 'Candidate'}</b>
                        </div>
                      </td>
                      <td><span className="pill p-info">{iv.round}</span></td>
                      <td>{iv.when.replace('T', ' ')}</td>
                      <td>{iv.panel}</td>
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
