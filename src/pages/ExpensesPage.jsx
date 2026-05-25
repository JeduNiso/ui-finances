import { useEffect, useState } from 'react'
import { PlusIcon, CalendarIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import useExpensesStore from '../stores/expensesStore'
import useAccountsStore from '../stores/accountsStore'
import { getCategories } from '../api/categories'
import ExpensesList from '../components/expenses/ExpensesList'
import ExpenseForm from '../components/expenses/ExpenseForm'
import ExpenseCalendar from '../components/expenses/ExpenseCalendar'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const PAY_EMPTY = { amount: '', paid_at: '', account_id: '' }

export default function ExpensesPage() {
  const { data, calendar, isLoading, fetchExpenses, fetchCalendar, createExpense, updateExpense, deleteExpense, pay } = useExpensesStore()
  const { data: accounts, fetchAccounts } = useAccountsStore()
  const [categories, setCategories] = useState([])
  const [view, setView] = useState('list') // 'list' | 'calendar'
  const [form, setForm] = useState(null)
  const [payTarget, setPayTarget] = useState(null)
  const [payForm, setPayForm] = useState(PAY_EMPTY)
  const [confirm, setConfirm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchExpenses()
    fetchCalendar()
    fetchAccounts()
    getCategories().then((r) => setCategories(r.data)).catch(() => {})
  }, [])

  const submit = async (payload) => {
    setSaving(true)
    try {
      if (payload.id) await updateExpense(payload.id, payload)
      else await createExpense(payload)
      setForm(null)
    } finally { setSaving(false) }
  }

  const submitPay = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await pay(payTarget.id, payForm)
      setPayTarget(null)
      setPayForm(PAY_EMPTY)
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  const confirmDelete = async () => {
    setSaving(true)
    try { await deleteExpense(confirm.id) } catch { /* ignore */ }
    setSaving(false)
    setConfirm(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-slate-800">Expenses</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
            className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm px-3 py-2 rounded-lg transition-colors"
          >
            {view === 'list' ? <CalendarIcon className="w-4 h-4" /> : <ListBulletIcon className="w-4 h-4" />}
            {view === 'list' ? 'Calendar' : 'List'}
          </button>
          <button
            onClick={() => setForm({})}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" /> New Expense
          </button>
        </div>
      </div>

      {isLoading && !data.length ? (
        <div className="text-center py-12 text-slate-400">Loading…</div>
      ) : view === 'list' ? (
        <ExpensesList
          items={data}
          onPay={(item) => setPayTarget(item)}
          onEdit={(item) => setForm(item)}
          onDelete={(item) => setConfirm(item)}
        />
      ) : (
        <ExpenseCalendar events={calendar} />
      )}

      {form !== null && (
        <ExpenseForm
          initial={form}
          onSubmit={submit}
          onClose={() => setForm(null)}
          categories={categories}
          accounts={accounts}
          loading={saving}
        />
      )}

      {payTarget && (
        <Modal title={`Pay — ${payTarget.name}`} onClose={() => setPayTarget(null)} size="sm">
          <form onSubmit={submitPay} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Amount *</label>
              <input type="number" step="0.01" min="0" required value={payForm.amount} onChange={(e) => setPayForm((f) => ({ ...f, amount: e.target.value }))} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Date *</label>
              <input type="date" required value={payForm.paid_at} onChange={(e) => setPayForm((f) => ({ ...f, paid_at: e.target.value }))} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Account</label>
              <select value={payForm.account_id} onChange={(e) => setPayForm((f) => ({ ...f, account_id: e.target.value }))} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="">Select account</option>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.account_number} ({a.currency ?? 'BOB'})</option>)}
              </select>
            </div>
            <div className="flex gap-3 justify-end mt-2">
              <button type="button" onClick={() => setPayTarget(null)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">{saving ? 'Saving…' : 'Pay'}</button>
            </div>
          </form>
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          message={`Delete expense "${confirm.name}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setConfirm(null)}
          loading={saving}
        />
      )}
    </div>
  )
}
