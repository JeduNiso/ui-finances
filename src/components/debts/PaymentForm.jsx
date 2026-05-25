import { useState } from 'react'
import Modal from '../ui/Modal'

const EMPTY = { amount: '', paid_at: '', account_id: '', notes: '' }

export default function PaymentForm({ debt, onSubmit, onClose, accounts = [], loading }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState(null)

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit(form)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message ?? 'An error occurred')
    }
  }

  return (
    <Modal title={`Payment — ${debt?.creditor}`} onClose={onClose} size="sm">
      <form onSubmit={submit} className="flex flex-col gap-4">
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">Amount *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={form.amount}
            onChange={handle('amount')}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">Date *</label>
          <input
            type="date"
            required
            value={form.paid_at}
            onChange={handle('paid_at')}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">Account</label>
          <select
            value={form.account_id}
            onChange={handle('account_id')}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select account</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.bank?.name ? `${a.bank.name} — ` : ''}{a.account_number} ({a.currency ?? 'BOB'})</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">Notes</label>
          <textarea
            value={form.notes}
            onChange={handle('notes')}
            rows={2}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />
        </div>

        <div className="flex gap-3 justify-end mt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Saving…' : 'Register'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
