import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar onToggleSidebar={() => setCollapsed((v) => !v)} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
