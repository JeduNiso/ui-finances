import { useEffect, useState } from 'react'
import useFamilyStore from '../stores/familyStore'
import { UserCircleIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

const roleColors = {
  admin: 'bg-indigo-100 text-indigo-700',
  member: 'bg-slate-100 text-slate-600',
  owner: 'bg-amber-100 text-amber-700',
}

export default function FamilyPage() {
  const { data, members, isLoading, error, fetchFamily, fetchMembers, createFamily, invite, remove } =
    useFamilyStore()
  const [email, setEmail] = useState('')
  const [familyName, setFamilyName] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchFamily()
    fetchMembers()
  }, [])

  const handleInvite = async (e) => {
    e.preventDefault()
    setInviting(true)
    setInviteError(null)
    try {
      await invite(email)
      setEmail('')
    } catch (err) {
      setInviteError(err.response?.data?.message ?? 'Failed to invite member')
    } finally {
      setInviting(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await createFamily({ name: familyName })
      fetchMembers()
    } catch { /* error shown via store */ }
    finally { setCreating(false) }
  }

  const handleRemove = async (userId) => {
    if (!window.confirm('Remove this member?')) return
    await remove(userId)
  }

  if (isLoading && !data && !members.length) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Loading…</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Family header / create */}
      {data ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h1 className="text-xl font-bold text-slate-800">{data.name}</h1>
          <p className="text-sm text-slate-400 mt-1">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Create a Family</h2>
          {error && (
            <p className="text-sm text-red-500 mb-3">{error?.message ?? JSON.stringify(error)}</p>
          )}
          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              type="text"
              required
              placeholder="Family name"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
          </form>
        </div>
      )}

      {/* Members list */}
      {members.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Members</h2>
          <ul className="space-y-3">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-3">
                <UserCircleIcon className="w-8 h-8 text-slate-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{m.name ?? m.email}</p>
                  <p className="text-xs text-slate-400 truncate">{m.email}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                    roleColors[m.role] ?? 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {m.role ?? 'member'}
                </span>
                <button
                  onClick={() => handleRemove(m.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                  title="Remove member"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Invite form */}
      {data && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Invite Member</h2>
          {inviteError && (
            <p className="text-sm text-red-500 mb-3">{inviteError}</p>
          )}
          <form onSubmit={handleInvite} className="flex gap-3">
            <input
              type="email"
              required
              placeholder="member@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              type="submit"
              disabled={inviting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              {inviting ? 'Inviting…' : 'Invite'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
