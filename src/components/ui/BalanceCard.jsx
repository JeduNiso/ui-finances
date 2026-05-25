import { useCurrency } from '../../hooks/useCurrency'

export default function BalanceCard({ account }) {
  const { format } = useCurrency()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 truncate">{account.name}</span>
        {account.bank && (
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {account.bank.name}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800">{format(account.balance ?? 0)}</p>
      {account.account_type && (
        <span className="text-xs text-slate-400 capitalize">{account.account_type}</span>
      )}
    </div>
  )
}
