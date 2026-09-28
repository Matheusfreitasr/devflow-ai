import { Icon, type IconName } from '../Icon'

const navigationItems: { label: string; icon: IconName; active?: boolean }[] = [
  { label: 'Dashboard', icon: 'dashboard', active: true },
  { label: 'Demandas', icon: 'demands' },
  { label: 'Projetos', icon: 'projects' },
  { label: 'Análise com IA', icon: 'sparkles' },
  { label: 'Configurações', icon: 'settings' },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand" aria-label="DevFlow AI">
        <span className="brand-mark" aria-hidden="true">D</span>
        <span className="brand-name">DevFlow <strong>AI</strong></span>
      </div>
      <p className="nav-heading">MENU PRINCIPAL</p>
      <nav aria-label="Menu principal">
        <ul className="nav-list">
          {navigationItems.map(({ label, icon, active }) => (
            <li key={label}>
              <span className={active ? 'nav-item is-active' : 'nav-item'} aria-current={active ? 'page' : undefined} title={label}>
                <Icon name={icon} size={19} /><span>{label}</span>
              </span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-note">
          <span className="note-icon"><Icon name="sparkles" size={17} /></span>
          <p>Menos retrabalho,<br /><strong>mais fluxo.</strong></p>
        </div>
        <div className="profile">
          <span className="avatar">MR</span>
          <span className="profile-copy"><strong>Matheus Rabelo</strong><small>Plano gratuito</small></span>
          <span className="profile-menu" aria-hidden="true">···</span>
        </div>
      </div>
    </aside>
  )
}
