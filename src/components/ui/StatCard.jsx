export default function StatCard({ title, value, sub, icon: Icon, trend, colorClass = 'text-indigo-600' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
      {Icon && (
        <div className={`p-2 rounded-lg bg-slate-50 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 truncate">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5 truncate">{value}</p>
        {sub && (
          <p className="text-xs text-slate-400 mt-0.5 truncate">{sub}</p>
        )}
        {trend !== undefined && (
          <p
            className={`text-xs mt-1 ${
              trend >= 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}%
          </p>
        )}
      </div>
    </div>
  )
}
