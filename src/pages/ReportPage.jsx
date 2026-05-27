import { useEffect, useState, useCallback } from 'react'
import dayjs from 'dayjs'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsRightLeftIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import useReportStore from '../stores/reportStore'
import { getCategories } from '../api/categories'
import { formatMoney } from '../utils/formatMoney'

// ─── Type config ──────────────────────────────────────────────────────────────
const TYPE_OPTIONS = [
  { value: 'income',   label: 'Income',   color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  { value: 'spending', label: 'Spending', color: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-500'   },
  { value: 'expense',  label: 'Expense',  color: 'bg-indigo-100 text-indigo-700',   dot: 'bg-indigo-500'  },
  { value: 'debt',     label: 'Debt',     color: 'bg-red-100 text-red-700',         dot: 'bg-red-500'     },
]
const TYPE_MAP = Object.fromEntries(TYPE_OPTIONS.map((t) => [t.value, t]))

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v, cur = 'BOB') => formatMoney(parseFloat(v ?? 0), cur)
const fmtBob = (v) => fmt(v, 'BOB')

const TODAY      = dayjs().format('YYYY-MM-DD')
const MONTH_START = dayjs().startOf('month').format('YYYY-MM-DD')

export default function ReportPage() {
  const { transactions, summary, isLoading, fetchReport } = useReportStore()
  const [categories, setCategories] = useState([])

  // ── Filters ────────────────────────────────────────────────────────────────
  const [dateFrom, setDateFrom]   = useState(MONTH_START)
  const [dateTo,   setDateTo]     = useState(TODAY)
  const [selTypes, setSelTypes]   = useState([]) // empty = all
  const [selCats,  setSelCats]    = useState([]) // empty = all

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data)).catch(() => {})
  }, [])

  const load = useCallback(() => {
    const params = {}
    if (dateFrom)         params.date_from  = dateFrom
    if (dateTo)           params.date_to    = dateTo
    if (selTypes.length)  params.types      = selTypes.join(',')
    if (selCats.length)   params.categories = selCats.join(',')
    fetchReport(params)
  }, [dateFrom, dateTo, selTypes, selCats, fetchReport])

  useEffect(() => { load() }, [load])

  // ── Type toggle ────────────────────────────────────────────────────────────
  const toggleType = (v) =>
    setSelTypes((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v])

  // ── Category toggle ────────────────────────────────────────────────────────
  const toggleCat = (id) =>
    setSelCats((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const clearFilters = () => {
    setDateFrom(MONTH_START)
    setDateTo(TODAY)
    setSelTypes([])
    setSelCats([])
  }

  const hasFilters = selTypes.length > 0 || selCats.length > 0 ||
    dateFrom !== MONTH_START || dateTo !== TODAY

  // ── Totals by currency from visible transactions ─────────────────────────
  const visibleTotals = transactions.reduce((acc, tx) => {
    const cur = tx.currency ?? 'BOB'
    const signed = tx.type === 'income' ? parseFloat(tx.amount) : -parseFloat(tx.amount)
    acc[cur] = (acc[cur] ?? 0) + signed
    return acc
  }, {})

  // ── Render ──────────────────────────────────────────────────────────────────
  const s = summary

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-slate-800">Financial Report</h1>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            <XMarkIcon className="w-3.5 h-3.5" /> Clear filters
          </button>
        )}
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <FunnelIcon className="w-4 h-4" /> Filters
        </div>

        {/* Date range */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Type toggles */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-500">Type</span>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((t) => {
              const active = selTypes.length === 0 || selTypes.includes(t.value)
              const selected = selTypes.includes(t.value)
              return (
                <button
                  key={t.value}
                  onClick={() => toggleType(t.value)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    selected
                      ? t.color + ' border-transparent font-medium'
                      : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${selected ? t.dot : 'bg-slate-300'}`} />
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Category toggles — only useful for spending/expense */}
        {categories.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-slate-500">Category <span className="text-slate-400 font-normal">(applies to Spending & Expense)</span></span>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const selected = selCats.includes(String(c.id))
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCat(String(c.id))}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      selected
                        ? 'bg-indigo-600 text-white border-transparent font-medium'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                    }`}
                  >
                    {c.icon ? `${c.icon} ` : ''}{c.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Summary cards ───────────────────────────────────────────────────── */}
      {s && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Income */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <ArrowUpIcon className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Income</span>
            </div>
            <span className="text-2xl font-bold text-emerald-600">{fmtBob(s.total_income_bob)}</span>
            {Object.entries(s.income_by_currency ?? {}).map(([cur, val]) => (
              <span key={cur} className="text-xs text-slate-400">{fmt(val, cur)}</span>
            ))}
          </div>

          {/* Total Outflow */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <ArrowDownIcon className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Outflow</span>
            </div>
            <span className="text-2xl font-bold text-red-600">{fmtBob(s.total_outflow_bob)}</span>
            {Object.entries(s.outflow_by_currency ?? {}).map(([cur, val]) => (
              <span key={cur} className="text-xs text-slate-400">{fmt(val, cur)}</span>
            ))}
          </div>

          {/* Net */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                parseFloat(s.net_bob ?? 0) >= 0 ? 'bg-indigo-50' : 'bg-orange-50'
              }`}>
                <ArrowsRightLeftIcon className={`w-4 h-4 ${
                  parseFloat(s.net_bob ?? 0) >= 0 ? 'text-indigo-600' : 'text-orange-600'
                }`} />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Net (Income − Outflow)</span>
            </div>
            <span className={`text-2xl font-bold ${
              parseFloat(s.net_bob ?? 0) >= 0 ? 'text-indigo-600' : 'text-orange-600'
            }`}>
              {fmtBob(s.net_bob)}
            </span>
            <span className="text-xs text-slate-400">{s.count} transaction{s.count !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      {/* ── Transactions table ──────────────────────────────────────────────── */}
      {isLoading && !transactions.length ? (
        <div className="text-center py-12 text-slate-400">Loading…</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">No transactions found for the selected filters</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Account</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => {
                const cfg = TYPE_MAP[tx.type]
                const isIncome = tx.type === 'income'
                return (
                  <tr key={tx.id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {dayjs(tx.date).format('MMM D, YYYY')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${cfg?.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg?.dot}`} />
                        {cfg?.label ?? tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 max-w-xs truncate">{tx.description}</td>
                    <td className="px-4 py-3 text-slate-500">{tx.category ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{tx.account ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{tx.user ?? '—'}</td>
                    <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${
                      isIncome ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {isIncome ? '+' : '−'}{fmt(tx.amount, tx.currency)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            {Object.keys(visibleTotals).length > 0 && (
              <tfoot className="border-t-2 border-slate-200 bg-slate-50">
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Totals shown
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-col items-end gap-1">
                      {['BOB', 'USD'].filter((c) => visibleTotals[c] !== undefined).map((c) => {
                        const val = visibleTotals[c]
                        return (
                          <span
                            key={c}
                            className={`font-bold text-sm whitespace-nowrap ${
                              val >= 0 ? 'text-emerald-600' : 'text-red-500'
                            }`}
                          >
                            {val >= 0 ? '+' : '−'}{formatMoney(Math.abs(val), c)}
                          </span>
                        )
                      })}
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  )
}
