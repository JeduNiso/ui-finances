import dayjs from 'dayjs'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useCurrency } from '../../hooks/useCurrency'

export default function SpendingTable({ items = [], onEdit, onDelete }) {
  const { format } = useCurrency()

  if (!items.length) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">No spending records found</div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Account</th>
            <th className="px-4 py-3 font-medium text-right">Amount</th>
            <th className="px-4 py-3 font-medium w-20" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id} className="bg-white hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                {dayjs(item.spent_at).format('MMM D, YYYY')}
              </td>
              <td className="px-4 py-3 text-slate-800">{item.description}</td>
              <td className="px-4 py-3 text-slate-500">{item.category?.name ?? '—'}</td>
              <td className="px-4 py-3 text-slate-500">{item.account?.name ?? '—'}</td>
              <td className="px-4 py-3 text-right font-semibold text-slate-800">
                {format(item.amount)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 justify-end">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
