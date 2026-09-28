import type { Demand, DemandPriority, DemandStatus } from '../../types/demand'

interface RecentDemandsProps {
  demands: Demand[]
  onSelectDemand: (demandId: string) => void
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

function formatCreatedAt(createdAt: string): string {
  const elapsedMinutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000)
  if (!Number.isFinite(elapsedMinutes) || elapsedMinutes < 0) return 'agora'
  if (elapsedMinutes < 1) return 'agora'
  if (elapsedMinutes < 60) return `há ${elapsedMinutes} min`
  if (elapsedMinutes < 24 * 60) return `há ${Math.floor(elapsedMinutes / 60)} h`
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(createdAt))
}

export function RecentDemands({ demands, onSelectDemand }: RecentDemandsProps) {
  return (
    <section className="recent-section" aria-labelledby="recent-heading">
      <div className="section-heading">
        <div><h2 id="recent-heading">Demandas recentes</h2><p>Acompanhe as últimas atualizações do seu time.</p></div>
        <span className="period-label">Últimas atualizações</span>
      </div>
      <div className="table-scroll">
        <table className="demand-table">
          <thead>
            <tr>
              <th scope="col">Demanda</th>
              <th scope="col">Prioridade</th>
              <th scope="col">Status</th>
              <th scope="col">Criada</th>
              <th scope="col"><span className="visually-hidden">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            {demands.length === 0 ? (
              <tr><td className="empty-row" colSpan={5}>Nenhuma demanda cadastrada ainda.</td></tr>
            ) : demands.map((demand) => (
                <tr key={demand.id}>
                  <td className="demand-title" title={demand.description}>{demand.title}</td>
                  <td>
                    <span className={`priority-badge ${priorityClass[demand.priority]}`}>
                      {demand.priority}
                    </span>
                  </td>
                  <td><span className={`status-badge ${statusClass[demand.status]}`}>{demand.status}</span></td>
                  <td className="updated-at">{formatCreatedAt(demand.createdAt)}</td>
                  <td className="demand-action-cell">
                    <button
                      className="demand-open-button"
                      type="button"
                      onClick={() => onSelectDemand(demand.id)}
                      aria-label={`Ver detalhes de ${demand.title}`}
                    >
                      Abrir detalhes
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
