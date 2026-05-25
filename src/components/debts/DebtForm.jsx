import { useState } from 'react'
import Modal from '../ui/Modal'

const STATUSES = ['active', 'paid', 'overdue']
const EMPTY = { creditor: '', original_amount: '', current_balance: '', description: '', status: 'active', account_id: '' }

export default function DebtForm({ initial, onSubmit, onClose, accounts = [], loading }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })
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
    <Modal title={initial?.id ? 'Edit Debt' : 'New Debt'} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {error && <p className="text-sm text-red-500">{error}</p>}

        {[['creditor', 'Creditor', 'text'], ['original_amount', 'Original Amount', 'number'], ['current_balance', 'Current Balance', 'number']].map(
          ([key, label, type]) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">{label} *</label>
              <input
                type={type}
                required={key !== 'current_balance'}
                min="0"
                step={type === 'number' ? '0.01' : undefined}
                value={form[key]}
                onChange={handle(key)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          ),
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">Description</label>
          <textarea
            value={form.description}
            onChange={handle('description')}
            rows={2}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">Status</label>
          <select
            value={form.status}
            onChange={handle('status')}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">Account</label>
          <select
            value={form.account_id}
            onChange={handle('account_id')}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select account</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.account_number}</option>)}
          </select>
        </div>

        <div className="flex gap-3 justify-end mt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
