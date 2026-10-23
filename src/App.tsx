import { PeoplePlusProvider, usePeoplePlus } from './people-plus/people-plus-context'
import { PlusShell } from './people-plus/PlusShell'
import { LoginPageView } from './people-plus/views/LoginPageView'

function SuiteContent() {
  const { user } = usePeoplePlus()

  if (!user) {
    return <LoginPageView />
  }

  return <PlusShell />
}

export default function App() {
  return (
    <PeoplePlusProvider>
      <SuiteContent />
    </PeoplePlusProvider>
  )
}
