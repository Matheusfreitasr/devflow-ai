import { Icon, type IconName } from '../Icon'

interface MetricCardProps {
  label: string
  value: string
  detail: string
  icon: IconName
  tone: 'violet' | 'blue' | 'green'
}

export function MetricCard({ label, value, detail, icon, tone }: MetricCardProps) {
  return (
    <article className="metric-card">
      <div className="metric-topline"><span className="metric-label">{label}</span><span className={`metric-icon tone-${tone}`}><Icon name={icon} size={19} /></span></div>
      <div className="metric-bottomline"><strong className="metric-value">{value}</strong><span className="metric-detail">{detail}</span></div>
    </article>
  )
}
