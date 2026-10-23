import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'
import { avatarColor, initials } from '../helpers'

export const ConnectViews: React.FC = () => {
  const { state, user, postKudos, likePost, addComment, toast } = usePeoplePlus()
  const [tab, setTab] = useState<'feed' | 'groups'>('feed')
  const [kudosTo, setKudosTo] = useState(state.employees[0].name)
  const [kudosText, setKudosText] = useState('')
  const [commentInput, setCommentInput] = useState<Record<string, string>>({})

  const handlePostKudos = (e: React.FormEvent) => {
    e.preventDefault()
    if (!kudosText.trim()) return
    postKudos(kudosTo, kudosText.trim())
    setKudosText('')
  }

  const handleAddComment = (postId: string) => {
    const text = commentInput[postId]
    if (!text || !text.trim()) return
    addComment(postId, text.trim())
    setCommentInput((prev) => ({ ...prev, [postId]: '' }))
  }

  return (
    <div className="view">
      <div className="head">
        <div>
          <div className="eyebrow">Connect & Community</div>
          <h1>Company Feed & Kudos</h1>
          <p>Share peer appreciation, celebrate milestones, and participate in company-wide interest groups.</p>
        </div>
      </div>

      <div className="tabs mb">
        <button className={tab === 'feed' ? 'on' : ''} onClick={() => setTab('feed')}>
          Company feed ({state.posts.length})
        </button>
        <button className={tab === 'groups' ? 'on' : ''} onClick={() => setTab('groups')}>
          Groups & clubs ({state.groups.length})
        </button>
      </div>

      {tab === 'feed' && (
        <div className="grid g-dash mt">
          <div>
            <div className="card composer" style={{ marginBottom: '18px' }}>
              <h3>Give Kudos or Share Update</h3>
              <form onSubmit={handlePostKudos}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <select
                    className="input"
                    value={kudosTo}
                    onChange={(e) => setKudosTo(e.target.value)}
                  >
                    {state.employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>Recognize {emp.name} ({emp.dept})</option>
                    ))}
                  </select>
                </div>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="What did they do that was awesome?"
                  value={kudosText}
                  onChange={(e) => setKudosText(e.target.value)}
                />
                <div className="cfoot" style={{ marginTop: '10px', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn primary">
                    <Icon name="heart" size={16} /> Share Kudos
                  </button>
                </div>
              </form>
            </div>

            <div className="list" style={{ gap: '16px' }}>
              {state.posts.map((p) => {
                const isLiked = p.likes.includes(user?.name || '')
                return (
                  <article key={p.id} className="card post">
                    <header>
                      <div className="who">
                        <div className="av" style={{ background: avatarColor(p.by) }}>{initials(p.by)}</div>
                        <div>
                          <b>{p.by}</b>
                          <span>{p.d}</span>
                        </div>
                      </div>
                      <span className="ptag" style={{ '--c': p.type === 'Kudos' ? '#D9466F' : 'var(--brand)' } as React.CSSProperties}>
                        {p.type}
                      </span>
                    </header>

                    {p.to && (
                      <div className="kudo" style={{ '--c': '#D9466F' } as React.CSSProperties}>
                        <div className="av" style={{ background: avatarColor(p.to) }}>{initials(p.to)}</div>
                        <div>
                          <span>Shoutout to</span>
                          <b>{p.to}</b>
                        </div>
                      </div>
                    )}

                    <p>{p.t}</p>

                    <footer>
                      <button className={`pbtn ${isLiked ? 'on' : ''}`} onClick={() => likePost(p.id)}>
                        <Icon name="heart" size={16} />
                        {p.likes.length} {p.likes.length === 1 ? 'Like' : 'Likes'}
                      </button>
                      <button className="pbtn" onClick={() => toast('Comment box focused')}>
                        <Icon name="chat" size={16} /> {p.comments.length} Comments
                      </button>
                    </footer>

                    {p.comments.length > 0 && (
                      <div style={{ marginTop: '12px', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
                        {p.comments.map((c, i) => (
                          <div key={i} className="cmt">
                            <div className="av" style={{ background: avatarColor(c.by) }}>{initials(c.by)}</div>
                            <div>
                              <b style={{ fontSize: '13px' }}>{c.by}</b>
                              <div style={{ fontSize: '13px', marginTop: '2px' }}>{c.t}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="cmt-in">
                      <div className="av" style={{ background: avatarColor(user?.name || 'Me') }}>
                        {initials(user?.name || 'M')}
                      </div>
                      <input
                        className="input"
                        placeholder="Write a comment..."
                        value={commentInput[p.id] || ''}
                        onChange={(e) => setCommentInput({ ...commentInput, [p.id]: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(p.id) }}
                      />
                      <button className="btn sm" onClick={() => handleAddComment(p.id)}>Reply</button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div>
            <div className="card">
              <h3>Company Announcements</h3>
              <div className="list">
                {state.announcements.map((a) => (
                  <div key={a.id} className="row">
                    <div className="grow">
                      <b>{a.t}</b>
                      <div className="sub">{a.b}</div>
                      <span className="muted" style={{ fontSize: '11px' }}>{a.d}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'groups' && (
        <div className="grid g3 mt">
          {state.groups.map((g) => (
            <div key={g.n} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3>{g.n}</h3>
                <span className="pill p-info">{g.m} members</span>
              </div>
              <p className="muted" style={{ fontSize: '13.5px', marginBottom: '16px' }}>
                Community channel for {g.n.toLowerCase()} discussions and events.
              </p>
              <button className="btn sm primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => toast(`Joined ${g.n}!`)}>
                Join group
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
