import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useCurrency } from '../../hooks/useCurrency'

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#84cc16']

export default function SpendingDonut({ data = [] }) {
  const { format } = useCurrency()

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        No spending data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="total"
          nameKey="category"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => format(v)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
