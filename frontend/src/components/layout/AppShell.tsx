import type { PropsWithChildren } from 'react'
import { Sidebar } from './Sidebar'

export function AppShell({ children }: PropsWithChildren) {
  return <div className="app-shell"><Sidebar /><main className="main-content">{children}</main></div>
}
