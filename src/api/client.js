import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL ?? 'https://api-finances-production.up.railway.app/api'

const client = axios.create({ baseURL: BASE })

// ── Request: attach Bearer token ─────────────────────────────────────────────
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response: auto-refresh on 401 ────────────────────────────────────────────
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE}/auth/token/refresh`, { refresh })
          const newAccess = data.token ?? data.access
          localStorage.setItem('access_token', newAccess)
          original.headers.Authorization = `Bearer ${newAccess}`
          return client(original)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      } else {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default client
