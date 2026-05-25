import { Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import useAuthStore from '../../stores/authStore'

export default function Topbar({ onToggleSidebar }) {
  const { user, family, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1 rounded hover:bg-slate-100 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="w-5 h-5 text-slate-600" />
        </button>
        {family && (
          <span className="text-sm font-medium text-slate-500">{family.name}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm text-slate-700 hidden sm:block">
            {user.name ?? user.email}
          </span>
        )}
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase select-none">
          {(user?.name ?? user?.email ?? '?')[0]}
        </div>
        <button
          onClick={handleLogout}
          className="p-1 rounded hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800"
          aria-label="Logout"
          title="Logout"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
