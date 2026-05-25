import { useState } from 'react'
import Modal from '../ui/Modal'
import { formatMoney } from '../../utils/formatMoney'

const FREQUENCIES = ['monthly', 'biweekly', 'weekly', 'yearly', 'one-time']
const EMPTY = { name: '', amount: '', day_of_month: '', frequency: 'monthly', account_id: '', category_id: '', debt_id: '' }

export default function ExpenseForm({ initial, onSubmit, onClose, categories = [], accounts = [], debts = [], loading }) {
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

  const activeDebts = debts.filter((d) => d.status === 'active')

  return (
    <Modal title={initial?.id ? 'Edit Expense' : 'New Expense'} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {error && <p className="text-sm text-red-500">{error}</p>}

        {[['name', 'Name', 'text'], ['amount', 'Amount', 'number'], ['day_of_month', 'Day of Month (1-31)', 'number']].map(
          ([key, label, type]) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">{label} *</label>
              <input
                type={type}
                required
                min={type === 'number' ? '0' : undefined}
                step={key === 'amount' ? '0.01' : undefined}
                value={form[key]}
                onChange={handle(key)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          ),
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">Frequency</label>
          <select
            value={form.frequency}
            onChange={handle('frequency')}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
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
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.bank?.name ? `${a.bank.name} — ` : ''}{a.account_number}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">Category</label>
          <select
            value={form.category_id}
            onChange={handle('category_id')}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {activeDebts.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">
              Link to Debt <span className="text-slate-400 font-normal">(optional — payments will reduce debt balance)</span>
            </label>
            <select
              value={form.debt_id}
              onChange={handle('debt_id')}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">No debt linked</option>
              {activeDebts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.creditor} — {formatMoney(d.current_balance, d.account?.currency ?? 'BOB')} remaining
                </option>
              ))}
            </select>
          </div>
        )}

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
