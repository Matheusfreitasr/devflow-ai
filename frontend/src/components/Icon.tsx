import type { ReactNode } from 'react'

export type IconName = 'dashboard' | 'demands' | 'projects' | 'sparkles' | 'settings' | 'plus' | 'check' | 'arrowLeft'

const iconShapes: Record<IconName, ReactNode> = {
  dashboard: <><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="5" rx="2" /><rect x="13" y="10" width="8" height="11" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /></>,
  demands: <><path d="M8 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" /><path d="M8 4a2 2 0 0 0 2 2h3m-5-2a2 2 0 0 1 2-2h3l4 4v2" /><path d="M7 12h5m-5 4h3m5-2 5-5 2 2-5 5-3 1z" /></>,
  projects: <><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M3 10h18" /></>,
  sparkles: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z" /><path d="m5 3 .6 1.4L7 5l-1.4.6L5 7l-.6-1.4L3 5l1.4-.6z" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 1.2-2.9 1.7 1.7 0 0 0-1.2-2.9 1.7 1.7 0 0 0-2.9-2.9 1.7 1.7 0 0 0-2.9-1.2 1.7 1.7 0 0 0-3.4 0 1.7 1.7 0 0 0-2.9 1.2 1.7 1.7 0 0 0-2.9 2.9 1.7 1.7 0 0 0-1.2 2.9A1.7 1.7 0 0 0 4.4 15a1.7 1.7 0 0 0 2.9 2.9 1.7 1.7 0 0 0 2.9 1.2 1.7 1.7 0 0 0 3.4 0 1.7 1.7 0 0 0 2.9-1.2 1.7 1.7 0 0 0 2.9-2.9z" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  arrowLeft: <><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></>,
}
interface IconProps { name: IconName; size?: number }

export function Icon({ name, size = 20 }: IconProps) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{iconShapes[name]}</svg>
}
