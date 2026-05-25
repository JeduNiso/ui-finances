import { useEffect, useState } from 'react'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import * as categoriesApi from '../api/categories'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const emptyForm = { name: '', icon: '', color: '' }

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await categoriesApi.getCategories()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(null); setShowForm(true) }
  const openEdit = (cat) => {
    setEditing(cat)
    setForm({ name: cat.name, icon: cat.icon ?? '', color: cat.color ?? '' })
    setError(null)
    setShowForm(true)
  }
  const closeForm = () => setShowForm(false)

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = { name: form.name, icon: form.icon || null, color: form.color || null }
      if (editing) {
        const { data } = await categoriesApi.updateCategory(editing.id, payload)
        setCategories((prev) => prev.map((c) => (c.id === editing.id ? data : c)))
      } else {
        const { data } = await categoriesApi.createCategory(payload)
        setCategories((prev) => [...prev, data])
      }
      closeForm()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await categoriesApi.deleteCategory(deleteTarget.id)
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Categories</h1>
          <p className="text-sm text-slate-400">Admin — manage spending categories</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm py-12 text-center">Loading…</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {categories.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-12">No categories yet</p>
          )}
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 px-5 py-3">
              {/* Color swatch */}
              <span
                className="w-3 h-3 rounded-full shrink-0 border border-slate-200"
                style={{ background: cat.color ?? '#e2e8f0' }}
              />
              {/* Icon */}
              {cat.icon && <span className="text-base">{cat.icon}</span>}
              <span className="flex-1 text-sm font-medium text-slate-800">{cat.name}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(cat)}
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
        <Modal title={editing ? 'Edit Category' : 'Add Category'} onClose={closeForm} size="sm">
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Name *</label>
              <input
                type="text"
                required
                autoFocus
                value={form.name}
                onChange={handle('name')}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-medium text-slate-600">Icon (emoji)</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={handle('icon')}
                  placeholder="🛒"
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">Color</label>
                <input
                  type="color"
                  value={form.color || '#6366f1'}
                  onChange={handle('color')}
                  className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
              </div>
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

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Category"
          message={`Delete "${deleteTarget.name}"? This cannot be undone.`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
