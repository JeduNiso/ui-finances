import Modal from './Modal'

export default function ConfirmDialog({ title = 'Confirm', message, onConfirm, onCancel, loading }) {
  return (
    <Modal title={title} onClose={onCancel} size="sm">
      <p className="text-sm text-slate-600 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Deleting…' : 'Confirm'}
        </button>
      </div>
    </Modal>
  )
}
