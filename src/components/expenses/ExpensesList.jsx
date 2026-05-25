import dayjs from 'dayjs'
import { CheckCircleIcon, ClockIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { formatMoney } from '../../utils/formatMoney'

export default function ExpensesList({ items = [], onPay, onEdit, onDelete }) {

  if (!items.length) {
    return <div className="text-center py-12 text-slate-400 text-sm">No expenses found</div>
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isPaid = item.status === 'paid'
        return (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-4"
          >
            <div className={`shrink-0 ${isPaid ? 'text-green-500' : 'text-amber-400'}`}>
              {isPaid ? (
                <CheckCircleIcon className="w-6 h-6" />
              ) : (
                <ClockIcon className="w-6 h-6" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">{item.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Day {item.day_of_month}
                {item.frequency && ` · ${item.frequency}`}
                {item.category && ` · ${item.category.name}`}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="font-semibold text-slate-800">{formatMoney(item.amount, item.account?.currency)}</p>
              {item.next_due_date && (
                <p className="text-xs text-slate-400">
                  Due {dayjs(item.next_due_date).format('MMM D')}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {onPay && !isPaid && (
                <button
                  onClick={() => onPay(item)}
                  className="p-1.5 rounded hover:bg-green-50 text-slate-400 hover:text-green-600 transition-colors"
                  title="Mark as paid"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item)}
                  className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
