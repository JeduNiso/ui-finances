import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CreditCardIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import useDashboardStore from '../stores/dashboardStore'
import StatCard from '../components/ui/StatCard'
import SpendingDonut from '../components/charts/SpendingDonut'
import MonthlyBarChart from '../components/charts/MonthlyBarChart'
import { formatMoney } from '../utils/formatMoney'

export default function DashboardPage() {
  const { data, isLoading, fetch } = useDashboardStore()

  useEffect(() => { fetch() }, [])

  if (isLoading && !data) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Loading…</div>
  }

  const stats = [
    {
      title: 'Total Balance (BOB)',
      value: formatMoney(data?.total_balance ?? 0, 'BOB'),
      icon: CreditCardIcon,
      colorClass: 'text-indigo-600',
    },
    {
      title: 'Monthly Spending (BOB)',
      value: formatMoney(data?.monthly_spending ?? 0, 'BOB'),
      icon: BanknotesIcon,
      colorClass: 'text-amber-500',
    },
    {
      title: 'Active Debts',
      value: data?.active_debts_count ?? 0,
      icon: ArrowTrendingDownIcon,
      colorClass: 'text-red-500',
    },
    {
      title: 'Upcoming Expenses',
      value: data?.upcoming_expenses_count ?? 0,
      icon: DocumentTextIcon,
      colorClass: 'text-teal-500',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <Link
          to="/report"
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 rounded-lg px-3 py-1.5 transition-colors"
        >
          <ChartBarIcon className="w-4 h-4" /> View Full Report
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Upcoming expense alerts */}
      {data?.upcoming_expenses?.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-700 mb-2">Upcoming this week</p>
          <div className="flex flex-wrap gap-2">
            {data.upcoming_expenses.map((exp) => (
              <span
                key={exp.id}
                className="text-xs bg-amber-100 text-amber-700 rounded-full px-3 py-1"
              >
                {exp.name} — {format(exp.amount)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">Spending by Category</p>
          <SpendingDonut data={data?.spending_by_category ?? []} />
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">Monthly Spending</p>
          <MonthlyBarChart data={data?.monthly_chart ?? []} />
        </div>
      </div>
    </div>
  )
}
