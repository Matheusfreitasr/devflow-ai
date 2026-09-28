import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { Dashboard } from './components/dashboard/Dashboard'
import { DemandForm } from './components/demands/DemandForm'
import { AppShell } from './components/layout/AppShell'
import { demandsApi } from './services/demands'
import type { Demand, NewDemandInput } from './types/demand'

function App() {
  const [demands, setDemands] = useState<Demand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isCreatingDemand, setIsCreatingDemand] = useState(false)

  useEffect(() => {
    let isMounted = true

    demandsApi.list()
      .then((loadedDemands) => {
        if (isMounted) setDemands(loadedDemands)
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : 'Não foi possível carregar as demandas.')
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const loadDemands = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      setDemands(await demandsApi.list())
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Não foi possível carregar as demandas.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  async function createDemand(input: NewDemandInput): Promise<Demand> {
    const demand = await demandsApi.create(input)
    setDemands((currentDemands) => [demand, ...currentDemands])
    setIsCreatingDemand(false)
    return demand
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
          isLoading={isLoading}
          loadError={loadError}
          onCreateDemand={() => setIsCreatingDemand(true)}
          onRetry={() => void loadDemands()}
        />
      )}
    </AppShell>
  )
}

export default App
