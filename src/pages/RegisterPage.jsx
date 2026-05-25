import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import * as authApi from '../api/auth'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await authApi.register(form)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      setError(data?.message ?? JSON.stringify(data?.errors) ?? 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Create account</h1>
        <p className="text-sm text-slate-500 mb-6">Start managing your finances</p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4">
          {[['name', 'Name', 'text'], ['email', 'Email', 'email'], ['password', 'Password', 'password'], ['password_confirmation', 'Confirm Password', 'password']].map(
            ([key, label, type]) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">{label}</label>
                <input
                  type={type}
                  required
                  autoFocus={key === 'name'}
                  value={form[key]}
                  onChange={handle(key)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            ),
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
