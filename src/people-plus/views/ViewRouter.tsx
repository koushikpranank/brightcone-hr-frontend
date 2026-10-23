import React from 'react'
import { usePeoplePlus } from '../people-plus-context'
import { SuiteDashboardView } from './SuiteDashboardView'
import { PeopleViews } from './PeopleViews'
import { ShiftViews } from './ShiftViews'
import { PayViews } from './PayViews'
import { ExpenseViews } from './ExpenseViews'
import { RecruitViews } from './RecruitViews'
import { PerformanceViews } from './PerformanceViews'
import { LearningViews } from './LearningViews'
import { SignViews } from './SignViews'
import { ConnectViews } from './ConnectViews'
import { WorkplaceViews } from './WorkplaceViews'
import { SuiteAdminViews } from './SuiteAdminViews'
import { AdvancedHrViews } from './AdvancedHrViews'

export const ViewRouter: React.FC = () => {
  const { activeApp, activeView } = usePeoplePlus()

  if (activeApp === 'people') return <PeopleViews />
  if (activeApp === 'shift') return <ShiftViews />
  if (activeApp === 'payroll') return <PayViews />
  if (activeApp === 'expense') return <ExpenseViews />
  if (activeApp === 'recruit') return <RecruitViews />
  if (activeApp === 'sign') return <SignViews />
  if (activeApp === 'connect') return <ConnectViews />
  if (activeApp === 'learn') return <LearningViews />

  // Plus / Advanced HR / Suite Views
  if (activeView === 'approvals' || activeView === 'audit' || activeView === 'settings') {
    return <SuiteAdminViews />
  }
  if (activeView === 'perf' || activeView === 'm_perf' || activeView === 'm_career') {
    return <PerformanceViews />
  }
  if (
    activeView === 'm_wfa' ||
    activeView === 'm_comp' ||
    activeView === 'm_actions' ||
    activeView === 'm_access' ||
    activeView === 'backup'
  ) {
    return <AdvancedHrViews />
  }
  if (activeView === 'docs' || activeView === 'assets' || activeView === 'tickets') {
    return <WorkplaceViews />
  }

  return <SuiteDashboardView />
}
