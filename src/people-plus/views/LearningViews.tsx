import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'

export const LearningViews: React.FC = () => {
  const { state, user, toast } = usePeoplePlus()
  const [filter, setFilter] = useState<'All' | 'Mandatory' | 'Elective'>('All')

  const myProgress = state.progress[user?.name || 'Rahul Varma'] || {}

  const filteredCourses = state.courses.filter((c) => {
    if (filter === 'All') return true
    return c.type === filter
  })

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Learn & Upskilling</div>
          <h1>Learning & Certifications</h1>
          <p>Mandatory statutory training, AI engineering curriculums, and professional certificates.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => toast('Certificate PDF generated for completed course!')}>
            <Icon name="check" size={16} /> Download certificates
          </button>
        </div>
      </div>

      <div className="tabs mb">
        <button className={filter === 'All' ? 'on' : ''} onClick={() => setFilter('All')}>
          All courses ({state.courses.length})
        </button>
        <button className={filter === 'Mandatory' ? 'on' : ''} onClick={() => setFilter('Mandatory')}>
          Mandatory compliance ({state.courses.filter((c) => c.type === 'Mandatory').length})
        </button>
        <button className={filter === 'Elective' ? 'on' : ''} onClick={() => setFilter('Elective')}>
          Electives & Skills ({state.courses.filter((c) => c.type === 'Elective').length})
        </button>
      </div>

      <div className="grid g3 mt">
        {filteredCourses.map((c) => {
          const prog = myProgress[c.id] || (c.type === 'Mandatory' ? 100 : 40)
          return (
            <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className={`pill ${c.type === 'Mandatory' ? 'p-bad' : 'p-info'}`}>{c.type}</span>
                <span className="muted" style={{ fontSize: '12px' }}>{c.dur}</span>
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{c.t}</h3>
              <p className="muted" style={{ fontSize: '13px', marginBottom: 'auto' }}>
                Audience: {c.aud} {c.due ? `· Due: ${c.due}` : ''}
              </p>
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span>Progress</span>
                  <b>{prog}%</b>
                </div>
                <div className="bar">
                  <span style={{ width: `${prog}%` }} />
                </div>
              </div>
              <div style={{ marginTop: '14px' }}>
                {prog >= 100 ? (
                  <button className="btn sm ok" style={{ width: '100%', justifyContent: 'center' }} onClick={() => toast(`Certificate verified for ${c.t}`)}>
                    <Icon name="check" size={14} /> Completed
                  </button>
                ) : (
                  <button className="btn sm primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => toast(`Starting module: ${c.t}`)}>
                    Continue course
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
