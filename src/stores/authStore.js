import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '../api/auth'

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      family: null,

      isAuthenticated: () => !!get().token,

      login: async (credentials) => {
        const { data } = await authApi.login(credentials)
        const access = data.token ?? data.access
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', data.refresh)
        set({ token: access, refreshToken: data.refresh, user: data.user ?? null })
        return data
      },

      logout: async () => {
        const refresh = get().refreshToken
        try { await authApi.logout({ refresh }) } catch { /* ignore */ }
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ token: null, refreshToken: null, user: null, family: null })
      },

      setUser: (user) => set({ user }),
      setFamily: (family) => set({ family }),
      reset: () => set({ token: null, refreshToken: null, user: null, family: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        family: state.family,
      }),
    },
  ),
)

export default useAuthStore
