import { useEffect, useState } from 'react'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import * as banksApi from '../api/banks'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const emptyForm = { name: '' }

export default function BanksAdminPage() {
  const [banks, setBanks] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)   // bank object being edited
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await banksApi.getBanks()
    setBanks(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(null); setShowForm(true) }
  const openEdit = (bank) => { setEditing(bank); setForm({ name: bank.name }); setError(null); setShowForm(true) }
  const closeForm = () => setShowForm(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editing) {
        const { data } = await banksApi.updateBank(editing.id, form)
        setBanks((prev) => prev.map((b) => (b.id === editing.id ? data : b)))
      } else {
        const { data } = await banksApi.createBank(form)
        setBanks((prev) => [...prev, data])
      }
      closeForm()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to save bank')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await banksApi.deleteBank(deleteTarget.id)
      setBanks((prev) => prev.filter((b) => b.id !== deleteTarget.id))
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Banks</h1>
          <p className="text-sm text-slate-400">Admin — manage bank catalog</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Add Bank
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm py-12 text-center">Loading…</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {banks.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-12">No banks yet</p>
          )}
          {banks.map((bank) => (
            <div key={bank.id} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm font-medium text-slate-800">{bank.name}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(bank)}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(bank)}
                  className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      {showForm && (
        <Modal title={editing ? 'Edit Bank' : 'Add Bank'} onClose={closeForm} size="sm">
          {error && (
            <p className="text-sm text-red-500 mb-3">{error}</p>
          )}
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Name</label>
              <input
                type="text"
                required
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={closeForm} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm delete */}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Bank"
          message={`Delete "${deleteTarget.name}"? This cannot be undone.`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
