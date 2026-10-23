import React, { useState } from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { Icon } from '../Icon'

export const LoginPageView: React.FC = () => {
  const { login, theme, toggleTheme } = usePeoplePlus()
  const [email, setEmail] = useState('ananya.rao@brightcone.ai')
  const [password, setPassword] = useState('Admin@123')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const success = login(email, password)
    if (!success) {
      setError('Invalid email or password. Please use one of the demo credentials below.')
    }
  }

  const handleSelectDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setError(null)
    login(demoEmail, demoPass)
  }

  return (
    <div className="login">
      {/* Brand & Product Showcase Pane */}
      <section className="lp">
        <div>
          <div className="logo">
            <img src="/brightcone-mark.png" alt="Brightcone" style={{ width: 36, height: 'auto' }} />
            <span>Brightcone <b>People Plus</b></span>
          </div>
          <p className="lede">
            The intelligent operating system for people operations, autonomous payroll, and talent intelligence.
          </p>

          <div className="glasses">
            <div className="glass">
              <b>All 9 Suite Apps in One Unified Core</b>
              <p>People, Recruit, Payroll, Expense, Sign, Connect, Learn, Shift, and Advanced HR.</p>
            </div>
            <div className="glass">
              <b>Autonomous Statutory Compliance</b>
              <p>Automated EPF, ESI, TDS calculations with instant bank transfer file generation.</p>
            </div>
            <div className="glass">
              <b>AI Applicant Tracking System</b>
              <p>Instant resume parsing, skill matching scores, and streamlined offer-to-hire pipelines.</p>
            </div>
          </div>
        </div>

        <div className="foot">
          © {new Date().getFullYear()} Brightcone, Inc. Enterprise Grade · SOC-2 Type II Certified
        </div>
      </section>

      {/* Authentication Form Pane */}
      <section className="lf">
        <div style={{ position: 'absolute', top: '24px', right: '28px' }}>
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>
        </div>

        <div className="lcard">
          <h2>Sign in to Brightcone</h2>
          <p className="sub">Access your employee self-service portal or administrative suite.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <span>Work Email</span>
              <input
                className="input"
                type="email"
                placeholder="name@brightcone.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Password</span>
                <span className="muted" style={{ fontSize: '12px' }}>Forgot password?</span>
              </div>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="lerr" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}>
              Sign in to People Plus
            </button>
          </form>

          <div className="or">
            <span>or sign in with demo accounts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="demo"
              onClick={() => handleSelectDemo('ananya.rao@brightcone.ai', 'Admin@123')}
            >
              <div>
                <b>Ananya Rao</b>
                <span>People Ops Lead · HR Admin</span>
              </div>
              <span className="tag">HR Admin Access</span>
            </button>

            <button
              type="button"
              className="demo"
              onClick={() => handleSelectDemo('rahul.varma@brightcone.ai', 'Welcome@123')}
            >
              <div>
                <b>Rahul Varma</b>
                <span>Backend Engineer · Employee</span>
              </div>
              <span className="tag">Employee Self-Service</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
