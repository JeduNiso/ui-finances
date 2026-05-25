export default function SpendingFilters({ filters, onChange, categories = [], accounts = [] }) {
  const handle = (key) => (e) => onChange({ ...filters, [key]: e.target.value || undefined })

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.category_id ?? ''}
        onChange={handle('category_id')}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        value={filters.account_id ?? ''}
        onChange={handle('account_id')}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        <option value="">All accounts</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>{a.account_number} ({a.currency ?? 'BOB'})</option>
        ))}
      </select>

      <input
        type="date"
        value={filters.date_from ?? ''}
        onChange={handle('date_from')}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        placeholder="From"
      />

      <input
        type="date"
        value={filters.date_to ?? ''}
        onChange={handle('date_to')}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        placeholder="To"
      />

      {Object.values(filters).some(Boolean) && (
        <button
          onClick={() => onChange({})}
          className="text-sm text-slate-500 hover:text-red-500 px-2 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  )
}
