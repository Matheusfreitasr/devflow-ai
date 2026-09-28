import { useState } from 'react'
import './App.css'
import { Dashboard } from './components/dashboard/Dashboard'
import { DemandForm } from './components/demands/DemandForm'
import { AppShell } from './components/layout/AppShell'
import { initialDemands } from './data/dashboard'
import type { Demand, NewDemandInput } from './types/demand'

function App() {
  const [demands, setDemands] = useState<Demand[]>(initialDemands)
  const [isCreatingDemand, setIsCreatingDemand] = useState(false)

  function createDemand(input: NewDemandInput) {
    const demand: Demand = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    setDemands((currentDemands) => [demand, ...currentDemands])
    setIsCreatingDemand(false)
  }

  return (
    <AppShell>
      {isCreatingDemand ? (
        <DemandForm
          onCancel={() => setIsCreatingDemand(false)}
          onCreate={createDemand}
        />
      ) : (
        <Dashboard
          demands={demands}
          onCreateDemand={() => setIsCreatingDemand(true)}
        />
      )}
    </AppShell>
  )
}

export default App
