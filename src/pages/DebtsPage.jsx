import { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import useDebtsStore from '../stores/debtsStore'
import useAccountsStore from '../stores/accountsStore'
import DebtCard from '../components/debts/DebtCard'
import DebtForm from '../components/debts/DebtForm'
import PaymentForm from '../components/debts/PaymentForm'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useCurrency } from '../hooks/useCurrency'

export default function DebtsPage() {
  const { data, summary, isLoading, fetchDebts, fetchSummary, createDebt, updateDebt, deleteDebt, addPayment } = useDebtsStore()
  const { data: accounts, fetchAccounts } = useAccountsStore()
  const { format } = useCurrency()
  const [form, setForm] = useState(null)
  const [payTarget, setPayTarget] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchDebts()
    fetchSummary()
    fetchAccounts()
  }, [])

  const submit = async (payload) => {
    setSaving(true)
    try {
      if (payload.id) await updateDebt(payload.id, payload)
      else await createDebt(payload)
      setForm(null)
    } finally { setSaving(false) }
  }

  const submitPayment = async (payload) => {
    setSaving(true)
    try {
      await addPayment(payTarget.id, payload)
      setPayTarget(null)
    } finally { setSaving(false) }
  }

  const confirmDelete = async () => {
    setSaving(true)
    try { await deleteDebt(confirm.id) } catch { /* ignore */ }
    setSaving(false)
    setConfirm(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-slate-800">Debts</h1>
        <button
          onClick={() => setForm({})}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> New Debt
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[['Total Owed', summary.total_owed], ['Total Paid', summary.total_paid], ['Active Debts', summary.active_count]].map(([label, val]) => (
            <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{typeof val === 'number' && val < 1000 && Number.isInteger(val) ? val : format(val ?? 0)}</p>
            </div>
          ))}
        </div>
      )}

      {isLoading && !data.length ? (
        <div className="text-center py-12 text-slate-400">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.map((debt) => (
            <DebtCard
              key={debt.id}
              debt={debt}
              onPay={(d) => setPayTarget(d)}
              onEdit={(d) => setForm(d)}
              onDelete={(d) => setConfirm(d)}
            />
          ))}
          {!data.length && <p className="text-slate-400 text-sm col-span-full text-center py-8">No debts</p>}
        </div>
      )}

      {form !== null && (
        <DebtForm
          initial={form}
          onSubmit={submit}
          onClose={() => setForm(null)}
          accounts={accounts}
          loading={saving}
        />
      )}

      {payTarget && (
        <PaymentForm
          debt={payTarget}
          onSubmit={submitPayment}
          onClose={() => setPayTarget(null)}
          accounts={accounts}
          loading={saving}
        />
      )}

      {confirm && (
        <ConfirmDialog
          message={`Delete debt to "${confirm.creditor}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setConfirm(null)}
          loading={saving}
        />
      )}
    </div>
  )
}
