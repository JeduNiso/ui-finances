import { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import useAccountsStore from '../stores/accountsStore'
import { getBanks } from '../api/banks'
import BalanceCard from '../components/ui/BalanceCard'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const EMPTY = { name: '', account_type: '', balance: '', bank_id: '' }
const TYPES = ['checking', 'savings', 'credit', 'investment', 'cash']

export default function AccountsPage() {
  const { data, isLoading, fetchAccounts, createAccount, updateAccount, deleteAccount } = useAccountsStore()
  const [banks, setBanks] = useState([])
  const [modal, setModal] = useState(null) // null | { mode: 'create'|'edit', item? }
  const [confirm, setConfirm] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAccounts()
    getBanks().then((r) => setBanks(r.data)).catch(() => {})
  }, [])

  const openCreate = () => { setForm(EMPTY); setModal({ mode: 'create' }) }
  const openEdit = (item) => { setForm({ name: item.name, account_type: item.account_type ?? '', balance: item.balance ?? '', bank_id: item.bank?.id ?? '' }); setModal({ mode: 'edit', item }) }

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal.mode === 'create') await createAccount(form)
      else await updateAccount(modal.item.id, form)
      setModal(null)
    } catch { /* errors shown by store */ }
    finally { setSaving(false) }
  }

  const confirmDelete = async () => {
    setSaving(true)
    try { await deleteAccount(confirm.id) } catch { /* ignore */ }
    setSaving(false)
    setConfirm(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Accounts</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> New Account
        </button>
      </div>

      {isLoading && !data.length ? (
        <div className="text-center py-12 text-slate-400">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.map((acc) => (
            <div key={acc.id} className="relative group">
              <BalanceCard account={acc} />
              <div className="absolute top-3 right-3 hidden group-hover:flex gap-1">
                <button onClick={() => openEdit(acc)} className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded hover:bg-slate-50 transition-colors">Edit</button>
                <button onClick={() => setConfirm(acc)} className="text-xs bg-white border border-red-100 text-red-500 px-2 py-0.5 rounded hover:bg-red-50 transition-colors">Del</button>
              </div>
            </div>
          ))}
          {!data.length && <p className="text-slate-400 text-sm col-span-full text-center py-8">No accounts yet</p>}
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === 'create' ? 'New Account' : 'Edit Account'} onClose={() => setModal(null)}>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Name *</label>
              <input required value={form.name} onChange={handle('name')} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Type</label>
              <select value={form.account_type} onChange={handle('account_type')} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="">Select type</option>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Balance</label>
              <input type="number" step="0.01" value={form.balance} onChange={handle('balance')} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Bank</label>
              <select value={form.bank_id} onChange={handle('bank_id')} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="">Select bank</option>
                {banks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 justify-end mt-2">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          message={`Delete account "${confirm.name}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setConfirm(null)}
          loading={saving}
        />
      )}
    </div>
  )
}
