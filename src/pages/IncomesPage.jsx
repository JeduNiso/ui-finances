import { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import useIncomesStore from '../stores/incomesStore'
import useAccountsStore from '../stores/accountsStore'
import IncomeTable from '../components/incomes/IncomeTable'
import IncomeForm from '../components/incomes/IncomeForm'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { formatMoney } from '../utils/formatMoney'

export default function IncomesPage() {
  const { data, isLoading, fetchIncomes, createIncome, updateIncome, deleteIncome } = useIncomesStore()
  const { data: accounts, fetchAccounts } = useAccountsStore()
  const [form, setForm] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchIncomes()
    fetchAccounts()
  }, [])

  const submit = async (payload) => {
    setSaving(true)
    try {
      if (payload.id) await updateIncome(payload.id, payload)
      else await createIncome(payload)
      await fetchIncomes()
      setForm(null)
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setSaving(true)
    try { await deleteIncome(confirm.id) } catch { /* ignore */ }
    setSaving(false)
    setConfirm(null)
  }

  // Monthly total grouped by currency
  const totals = data.reduce((acc, item) => {
    const cur = item.account?.currency ?? 'BOB'
    acc[cur] = (acc[cur] ?? 0) + parseFloat(item.amount)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-slate-800">Incomes</h1>
        <button
          onClick={() => setForm({})}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> New Income
        </button>
      </div>

      {/* Summary cards */}
      {Object.keys(totals).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.entries(totals).map(([currency, total]) => (
            <div key={currency} className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col gap-1">
              <span className="text-xs text-slate-500 font-medium">Total {currency}</span>
              <span className="text-xl font-bold text-emerald-600">{formatMoney(total, currency)}</span>
            </div>
          ))}
          <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col gap-1">
            <span className="text-xs text-slate-500 font-medium">Records</span>
            <span className="text-xl font-bold text-slate-800">{data.length}</span>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading && !data.length ? (
        <div className="text-center py-12 text-slate-400">Loading…</div>
      ) : (
        <IncomeTable
          items={data}
          onEdit={(item) => setForm(item)}
          onDelete={(item) => setConfirm(item)}
        />
      )}

      {form !== null && (
        <IncomeForm
          initial={form}
          onSubmit={submit}
          onClose={() => setForm(null)}
          accounts={accounts}
          loading={saving}
        />
      )}

      {confirm && (
        <ConfirmDialog
          message={`Delete "${confirm.description}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setConfirm(null)}
          loading={saving}
        />
      )}
    </div>
  )
}
