import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  CreditCardIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  BuildingLibraryIcon,
  TagIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline'
import useAuthStore from '../../stores/authStore'

const links = [
  { to: '/', label: 'Dashboard', icon: HomeIcon, end: true },
  { to: '/accounts', label: 'Accounts', icon: CreditCardIcon },
  { to: '/spending', label: 'Spending', icon: BanknotesIcon },
  { to: '/expenses', label: 'Expenses', icon: DocumentTextIcon },
  { to: '/debts', label: 'Debts', icon: ArrowTrendingDownIcon },
  { to: '/family', label: 'Family', icon: UsersIcon },
]

const adminLinks = [
  { to: '/admin/banks', label: 'Banks', icon: BuildingLibraryIcon },
  { to: '/admin/categories', label: 'Categories', icon: TagIcon },
]

export default function Sidebar({ collapsed, onToggle }) {
  const user = useAuthStore((s) => s.user)

  return (
    <aside
      className={`flex flex-col bg-slate-900 text-white transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      } min-h-screen`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
        {!collapsed && <span className="font-bold text-lg tracking-tight">Finances</span>}
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-slate-700 transition-colors ml-auto"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronDoubleRightIcon className="w-5 h-5" />
          ) : (
            <ChevronDoubleLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {/* Admin section — only shown to staff users */}
        {user?.is_staff && (
          <>
            {!collapsed && (
              <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Admin
              </p>
            )}
            {collapsed && <div className="my-2 border-t border-slate-700" />}
            {adminLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  )
}
