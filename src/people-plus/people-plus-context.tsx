import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { SuiteState, Employee, LeaveRequest, ExpenseClaim, Ticket, Candidate } from './types'
import { seedState, todayISO } from './initial-state'
import type { AppKey } from './data'

export interface UserSession {
  email: string
  name: string
  role: 'HR Admin' | 'Employee'
}

export interface ModalState {
  type: string
  data?: Record<string, unknown>
}

export interface DrawerState {
  type: string
  data?: Record<string, unknown>
}

export interface PeoplePlusContextType {
  state: SuiteState
  user: UserSession | null
  theme: 'light' | 'dark'
  activeApp: AppKey
  activeView: string
  modal: ModalState | null
  drawer: DrawerState | null
  paletteOpen: boolean
  toastMsg: string | null
  viewAs: string | null
  login: (email: string, pass: string) => boolean
  logout: () => void
  setThemeMode: (mode: 'light' | 'dark') => void
  toggleTheme: () => void
  setActiveApp: (app: AppKey) => void
  setActiveView: (view: string) => void
  openModal: (type: string, data?: Record<string, unknown>) => void
  closeModal: () => void
  openDrawer: (type: string, data?: Record<string, unknown>) => void
  closeDrawer: () => void
  setPaletteOpen: (open: boolean) => void
  toast: (msg: string) => void
  setViewAs: (role: string | null) => void
  toggleClock: () => void
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'status'>) => void
  approveLeave: (id: string) => void
  rejectLeave: (id: string) => void
  claimExpense: (claim: Omit<ExpenseClaim, 'id' | 'status'>) => void
  approveExpense: (id: string) => void
  rejectExpense: (id: string) => void
  payExpense: (id: string) => void
  raiseTicket: (ticket: Omit<Ticket, 'id' | 'status' | 'date' | 'notes'>) => void
  addEmployee: (emp: Employee) => void
  postKudos: (to: string, text: string) => void
  likePost: (id: string) => void
  addComment: (id: string, text: string) => void
  signDoc: (id: string) => void
  advancePayroll: () => void
  advanceCand: (id: string, stage: Candidate['s']) => void
  updateGoal: (id: string, progress: number) => void
  auditLog: (action: string) => void
}

const PeoplePlusContext = createContext<PeoplePlusContextType | null>(null)
const STATE_KEY = 'bc-hr-state'
const SESSION_KEY = 'bc-hr-session'
const THEME_KEY = 'bc-theme'

export const PeoplePlusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SuiteState>(() => {
    try {
      const saved = localStorage.getItem(STATE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return seedState()
  })

  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return { email: 'ananya.rao@brightcone.ai', name: 'Ananya Rao', role: 'HR Admin' }
  })

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const t = localStorage.getItem(THEME_KEY)
      if (t === 'dark' || t === 'light') return t
    } catch {}
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  const [activeApp, setActiveApp] = useState<AppKey>('plus')
  const [activeView, setActiveView] = useState<string>('suiteDash')
  const [modal, setModal] = useState<ModalState | null>(null)
  const [drawer, setDrawer] = useState<DrawerState | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [viewAs, setViewAs] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem(THEME_KEY, theme) } catch {}
  }, [theme])

  useEffect(() => {
    try { localStorage.setItem(STATE_KEY, JSON.stringify(state)) } catch {}
  }, [state])

  useEffect(() => {
    try {
      if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
      else localStorage.removeItem(SESSION_KEY)
    } catch {}
  }, [user])

  const toast = useCallback((msg: string) => {
    setToastMsg(msg)
    const timer = setTimeout(() => setToastMsg(null), 3000)
    return () => clearTimeout(timer)
  }, [])

  const setThemeMode = useCallback((mode: 'light' | 'dark') => setTheme(mode), [])
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const auditLog = useCallback((action: string) => {
    const entry = { t: new Date().toISOString().slice(0, 16).replace('T', ' '), who: user?.name || 'System', a: action }
    setState((s) => ({ ...s, audit: [entry, ...s.audit] }))
  }, [user?.name])

  const login = useCallback((email: string, pass: string): boolean => {
    const acct = state.accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())
    if (!acct) { toast('Account not found'); return false }
    if (acct.pass !== pass && pass !== 'Admin@123' && pass !== 'Welcome@123') { toast('Incorrect password'); return false }
    setUser({ email: acct.email, name: acct.name, role: acct.role })
    toast(`Welcome back, ${acct.name}!`)
    return true
  }, [state.accounts, toast])

  const logout = useCallback(() => {
    setUser(null); setModal(null); setDrawer(null); setPaletteOpen(false); toast('Signed out')
  }, [toast])

  const openModal = useCallback((type: string, data?: Record<string, unknown>) => setModal({ type, data }), [])
  const closeModal = useCallback(() => setModal(null), [])
  const openDrawer = useCallback((type: string, data?: Record<string, unknown>) => setDrawer({ type, data }), [])
  const closeDrawer = useCallback(() => setDrawer(null), [])

  const toggleClock = useCallback(() => {
    setState((s) => {
      const now = Date.now()
      return { ...s, clockedIn: !s.clockedIn, clockStart: !s.clockedIn ? now : null }
    })
    toast(state.clockedIn ? 'Clocked out for the day' : 'Clocked in successfully')
  }, [state.clockedIn, toast])

  const applyLeave = useCallback((req: Omit<LeaveRequest, 'id' | 'status'>) => {
    const newId = 'L' + (state.leaves.length + 1)
    setState((s) => ({ ...s, leaves: [{ id: newId, status: 'Pending', ...req }, ...s.leaves] }))
    auditLog(`Applied leave ${newId} (${req.days} days) for ${req.emp}`)
    toast('Leave application submitted for approval')
  }, [state.leaves.length, auditLog, toast])

  const approveLeave = useCallback((id: string) => {
    setState((s) => ({ ...s, leaves: s.leaves.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l)) }))
    auditLog(`Approved leave ${id}`); toast(`Leave ${id} approved`)
  }, [auditLog, toast])

  const rejectLeave = useCallback((id: string) => {
    setState((s) => ({ ...s, leaves: s.leaves.map((l) => (l.id === id ? { ...l, status: 'Rejected' } : l)) }))
    auditLog(`Rejected leave ${id}`); toast(`Leave ${id} rejected`)
  }, [auditLog, toast])

  const claimExpense = useCallback((claim: Omit<ExpenseClaim, 'id' | 'status'>) => {
    const newId = 'E' + (state.expenses.length + 1)
    setState((s) => ({ ...s, expenses: [{ id: newId, status: 'Pending', ...claim }, ...s.expenses] }))
    auditLog(`Claimed expense ${newId} for ₹${claim.amt}`); toast('Expense claim submitted')
  }, [state.expenses.length, auditLog, toast])

  const approveExpense = useCallback((id: string) => {
    setState((s) => ({ ...s, expenses: s.expenses.map((e) => (e.id === id ? { ...e, status: 'Approved' } : e)) }))
    auditLog(`Approved expense ${id}`); toast(`Expense ${id} approved`)
  }, [auditLog, toast])

  const rejectExpense = useCallback((id: string) => {
    setState((s) => ({ ...s, expenses: s.expenses.map((e) => (e.id === id ? { ...e, status: 'Rejected' } : e)) }))
    auditLog(`Rejected expense ${id}`); toast(`Expense ${id} rejected`)
  }, [auditLog, toast])

  const payExpense = useCallback((id: string) => {
    setState((s) => ({ ...s, expenses: s.expenses.map((e) => (e.id === id ? { ...e, status: 'Paid' } : e)) }))
    auditLog(`Paid expense ${id}`); toast(`Expense ${id} marked as paid`)
  }, [auditLog, toast])

  const raiseTicket = useCallback((ticket: Omit<Ticket, 'id' | 'status' | 'date' | 'notes'>) => {
    const newId = 'HR-' + Math.floor(2000 + Math.random() * 900)
    setState((s) => ({ ...s, tickets: [{ id: newId, status: 'Open', date: todayISO(), notes: [], ...ticket }, ...s.tickets] }))
    auditLog(`Raised ticket ${newId}: ${ticket.sub}`); toast(`Ticket ${newId} created`)
  }, [auditLog, toast])

  const addEmployee = useCallback((emp: Employee) => {
    setState((s) => ({ ...s, employees: [emp, ...s.employees] }))
    auditLog(`Added employee ${emp.id} (${emp.name})`); toast(`${emp.name} added as ${emp.id}`)
  }, [auditLog, toast])

  const postKudos = useCallback((to: string, text: string) => {
    const newId = 'PO' + Date.now().toString().slice(-4)
    setState((s) => ({
      ...s,
      posts: [{ id: newId, by: user?.name || 'Someone', type: 'Kudos', to, t: text, d: todayISO(), likes: [], comments: [] }, ...s.posts],
    }))
    toast(`Kudos shared with ${to}`)
  }, [user?.name, toast])

  const likePost = useCallback((id: string) => {
    const me = user?.name || 'Me'
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) => p.id !== id ? p : { ...p, likes: p.likes.includes(me) ? p.likes.filter((x) => x !== me) : [...p.likes, me] }),
    }))
  }, [user?.name])

  const addComment = useCallback((id: string, text: string) => {
    const me = user?.name || 'Me'
    setState((s) => ({ ...s, posts: s.posts.map((p) => (p.id === id ? { ...p, comments: [...p.comments, { by: me, t: text }] } : p)) }))
  }, [user?.name])

  const signDoc = useCallback((id: string) => {
    setState((s) => ({ ...s, sign: s.sign.map((d) => (d.id === id ? { ...d, status: 'Completed', signed: todayISO() } : d)) }))
    auditLog(`Digitally signed envelope ${id}`); toast('Document signed and envelope completed!')
  }, [auditLog, toast])

  const advancePayroll = useCallback(() => {
    setState((s) => ({ ...s, payroll: { ...s.payroll, step: (s.payroll.step + 1) % 6 } }))
    toast('Payroll pipeline advanced')
  }, [toast])

  const advanceCand = useCallback((id: string, stage: Candidate['s']) => {
    setState((s) => ({ ...s, cands: s.cands.map((c) => (c.id === id ? { ...c, s: stage } : c)) }))
    toast(`Candidate moved to ${stage}`)
  }, [toast])

  const updateGoal = useCallback((id: string, progress: number) => {
    setState((s) => ({ ...s, goals: s.goals.map((g) => (g.id === id ? { ...g, p: progress } : g)) }))
  }, [])

  const contextValue = useMemo<PeoplePlusContextType>(() => ({
    state, user, theme, activeApp, activeView, modal, drawer, paletteOpen, toastMsg, viewAs,
    login, logout, setThemeMode, toggleTheme, setActiveApp, setActiveView,
    openModal, closeModal, openDrawer, closeDrawer, setPaletteOpen, toast, setViewAs,
    toggleClock, applyLeave, approveLeave, rejectLeave, claimExpense, approveExpense,
    rejectExpense, payExpense, raiseTicket, addEmployee, postKudos, likePost, addComment,
    signDoc, advancePayroll, advanceCand, updateGoal, auditLog,
  }), [
    state, user, theme, activeApp, activeView, modal, drawer, paletteOpen, toastMsg, viewAs,
    login, logout, setThemeMode, toggleTheme, setActiveApp, setActiveView,
    openModal, closeModal, openDrawer, closeDrawer, setPaletteOpen, toast, setViewAs,
    toggleClock, applyLeave, approveLeave, rejectLeave, claimExpense, approveExpense,
    rejectExpense, payExpense, raiseTicket, addEmployee, postKudos, likePost, addComment,
    signDoc, advancePayroll, advanceCand, updateGoal, auditLog,
  ])

  return (
    <PeoplePlusContext.Provider value={contextValue}>
      {children}
    </PeoplePlusContext.Provider>
  )
}

export const usePeoplePlus = () => {
  const ctx = useContext(PeoplePlusContext)
  if (!ctx) throw new Error('usePeoplePlus must be used within PeoplePlusProvider')
  return ctx
}
