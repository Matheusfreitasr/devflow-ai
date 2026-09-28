import { Icon } from '../Icon'
import type { Demand, DemandPriority, DemandStatus } from '../../types/demand'
import { DemandAnalysisPanel } from './DemandAnalysisPanel'

interface DemandDetailsProps {
  demand: Demand
  onBack: () => void
}

const statusClass: Record<DemandStatus, string> = {
  Backlog: 'status-waiting',
  'Em desenvolvimento': 'status-progress',
  'Em revisão': 'status-review',
  Concluído: 'status-done',
}

const priorityClass: Record<DemandPriority, string> = {
  Baixa: 'priority-low',
  Média: 'priority-medium',
  Alta: 'priority-high',
}

function formatDate(date: string): string {
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return 'Data indisponível'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(parsedDate)
}

export function DemandDetails({ demand, onBack }: DemandDetailsProps) {
  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-divider">/</span>
          <span>Demandas</span>
          <span className="breadcrumb-divider">/</span>
          <strong>Detalhes</strong>
        </div>
        <div className="topbar-actions">
          <span className="online-indicator"><span /> Espaço de trabalho</span>
          <span className="avatar avatar-small" aria-label="Matheus Pereira">MP</span>
        </div>
      </header>

      <div className="page-content demand-page">
        <button className="back-link" type="button" onClick={onBack}>
          <Icon name="arrowLeft" size={17} />
          Voltar ao dashboard
        </button>

        <section className="detail-page-heading" aria-labelledby="demand-detail-title">
          <p className="eyebrow">DEMANDA</p>
          <h1 id="demand-detail-title">{demand.title}</h1>
          <div className="detail-badges">
            <span className={`priority-badge ${priorityClass[demand.priority]}`}>{demand.priority}</span>
            <span className={`status-badge ${statusClass[demand.status]}`}>{demand.status}</span>
          </div>
        </section>

        <section className="detail-card" aria-labelledby="demand-description-heading">
          <div className="detail-section-heading">
            <div>
              <p className="eyebrow">VISÃO GERAL</p>
              <h2 id="demand-description-heading">Descrição da demanda</h2>
            </div>
          </div>
          <p className="demand-description">{demand.description}</p>
          <dl className="demand-metadata">
            <div>
              <dt>Criada em</dt>
              <dd>{formatDate(demand.createdAt)}</dd>
            </div>
            <div className="metadata-id">
              <dt>Identificador</dt>
              <dd title={demand.id}>{demand.id}</dd>
            </div>
          </dl>
        </section>

        <DemandAnalysisPanel demandId={demand.id} />
      </div>
    </>
  )
}
