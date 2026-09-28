import { Icon } from '../Icon'
import type { Demand } from '../../types/demand'
import { MetricCard } from './MetricCard'
import { RecentDemands } from './RecentDemands'

interface DashboardProps {
  demands: Demand[]
  onCreateDemand: () => void
}

export function Dashboard({ demands, onCreateDemand }: DashboardProps) {
  const completedCount = demands.filter((demand) => demand.status === 'Concluído').length
  const metrics = [
    { label: 'Projetos', value: '12', detail: '3 ativos este mês', icon: 'projects', tone: 'violet' },
    { label: 'Demandas', value: String(demands.length), detail: 'no total', icon: 'demands', tone: 'blue' },
    { label: 'Concluídas', value: String(completedCount), detail: 'demandas finalizadas', icon: 'check', tone: 'green' },
  ] as const

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-divider">/</span><strong>Visão geral</strong></div>
        <div className="topbar-actions"><span className="online-indicator"><span /> Espaço de trabalho</span><span className="avatar avatar-small" aria-label="Matheus Pereira">MP</span></div>
      </header>
      <div className="page-content">
        <section className="dashboard-intro" aria-labelledby="page-title">
          <div><p className="eyebrow">VISÃO GERAL</p><h1 id="page-title">Dashboard</h1><p className="page-subtitle">Transforme demandas em especificações técnicas com apoio de IA.</p></div>
          <button className="primary-button" type="button" onClick={onCreateDemand}>
            <Icon name="plus" size={18} />Nova demanda
          </button>
        </section>
        <section className="metrics-grid" aria-label="Resumo do workspace">
          {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
        </section>
        <RecentDemands demands={demands} />
        <footer className="page-footer">DevFlow AI <span>·</span> Organize seu fluxo de desenvolvimento</footer>
      </div>
    </>
  )
}
