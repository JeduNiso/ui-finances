import { formatMoney } from '../../utils/formatMoney'

export default function BalanceCard({ account }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 truncate">{account.account_number}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {account.currency ?? 'BOB'}
          </span>
          {account.bank && (
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {account.bank.name}
            </span>
          )}
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-800">
        {formatMoney(account.balance ?? 0, account.currency ?? 'BOB')}
      </p>
    </div>
  )
}
