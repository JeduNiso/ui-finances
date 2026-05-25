import { create } from 'zustand'
import * as accountsApi from '../api/accounts'

const useAccountsStore = create((set) => ({
  data: [],
  summary: null,
  isLoading: false,
  error: null,

  fetchAccounts: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await accountsApi.getAccounts()
      set({ data, isLoading: false })
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
    }
  },

  fetchSummary: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await accountsApi.getSummary(id)
      set({ summary: data, isLoading: false })
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
    }
  },

  createAccount: async (payload) => {
    const { data } = await accountsApi.createAccount(payload)
    set((s) => ({ data: [...s.data, data] }))
    return data
  },

  updateAccount: async (id, payload) => {
    const { data } = await accountsApi.updateAccount(id, payload)
    set((s) => ({ data: s.data.map((a) => (a.id === id ? data : a)) }))
    return data
  },

  deleteAccount: async (id) => {
    await accountsApi.deleteAccount(id)
    set((s) => ({ data: s.data.filter((a) => a.id !== id) }))
  },

  reset: () => set({ data: [], summary: null, isLoading: false, error: null }),
}))

export default useAccountsStore
