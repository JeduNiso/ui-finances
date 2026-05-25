import { useCurrency } from '../../hooks/useCurrency'

const STATUS_COLORS = {
  active: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
}

export default function DebtCard({ debt, onPay, onEdit, onDelete }) {
  const { format } = useCurrency()
  const original = Number(debt.original_amount ?? 0)
  const current = Number(debt.current_balance ?? 0)
  const pct = original > 0 ? Math.min(100, ((original - current) / original) * 100) : 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-800">{debt.creditor}</p>
          {debt.description && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{debt.description}</p>
          )}
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize shrink-0 ${
            STATUS_COLORS[debt.status] ?? 'bg-slate-100 text-slate-600'
          }`}
        >
          {debt.status}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Remaining: {format(current)}</span>
          <span>{pct.toFixed(0)}% paid</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-slate-400 mt-1">Original: {format(original)}</p>
      </div>

      <div className="flex gap-2">
        {onPay && (
          <button
            onClick={() => onPay(debt)}
            className="flex-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-1.5 transition-colors"
          >
            Payment
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(debt)}
            className="flex-1 text-xs border border-slate-200 hover:bg-slate-50 rounded-lg py-1.5 transition-colors"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(debt)}
            className="text-xs border border-red-100 text-red-400 hover:bg-red-50 rounded-lg px-3 py-1.5 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
