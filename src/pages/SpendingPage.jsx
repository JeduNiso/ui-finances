import { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import useSpendingStore from '../stores/spendingStore'
import useAccountsStore from '../stores/accountsStore'
import { getCategories } from '../api/categories'
import SpendingTable from '../components/spending/SpendingTable'
import SpendingFilters from '../components/spending/SpendingFilters'
import SpendingForm from '../components/spending/SpendingForm'
import ConfirmDialog from '../components/ui/ConfirmDialog'

export default function SpendingPage() {
  const { data, isLoading, filters, setFilters, fetchSpendings, createSpending, updateSpending, deleteSpending } = useSpendingStore()
  const { data: accounts, fetchAccounts } = useAccountsStore()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(null) // null | {} | item
  const [confirm, setConfirm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAccounts()
    getCategories().then((r) => setCategories(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    fetchSpendings(filters)
  }, [filters])

  const submit = async (payload) => {
    setSaving(true)
    try {
      if (payload.id) await updateSpending(payload.id, payload)
      else await createSpending(payload)
      await Promise.all([fetchSpendings(filters), fetchAccounts()])
      setForm(null)
    } finally { setSaving(false) }
  }

  const confirmDelete = async () => {
    setSaving(true)
    try {
      await deleteSpending(confirm.id)
      await fetchAccounts()
    } catch { /* ignore */ }
    setSaving(false)
    setConfirm(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-slate-800">Spending</h1>
        <button
          onClick={() => setForm({})}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> New Entry
        </button>
      </div>

      <SpendingFilters filters={filters} onChange={setFilters} categories={categories} accounts={accounts} />

      {isLoading && !data.length ? (
        <div className="text-center py-12 text-slate-400">Loading…</div>
      ) : (
        <SpendingTable
          items={data}
          onEdit={(item) => setForm(item)}
          onDelete={(item) => setConfirm(item)}
        />
      )}

      {form !== null && (
        <SpendingForm
          initial={form}
          onSubmit={submit}
          onClose={() => setForm(null)}
          categories={categories}
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
