import { create } from 'zustand'
import * as spendingApi from '../api/spending'

const useSpendingStore = create((set) => ({
  data: [],
  summary: null,
  filters: {},
  isLoading: false,
  error: null,

  setFilters: (filters) => set({ filters }),

  fetchSpendings: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await spendingApi.getSpendings(params)
      set({ data, isLoading: false })
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
    }
  },

  fetchSummary: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await spendingApi.getSpendingSummary()
      set({ summary: data, isLoading: false })
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
    }
  },

  createSpending: async (payload) => {
    const { data } = await spendingApi.createSpending(payload)
    set((s) => ({ data: [data, ...s.data] }))
    return data
  },

  updateSpending: async (id, payload) => {
    const { data } = await spendingApi.updateSpending(id, payload)
    set((s) => ({ data: s.data.map((x) => (x.id === id ? data : x)) }))
    return data
  },

  deleteSpending: async (id) => {
    await spendingApi.deleteSpending(id)
    set((s) => ({ data: s.data.filter((x) => x.id !== id) }))
  },

  reset: () => set({ data: [], summary: null, filters: {}, isLoading: false, error: null }),
}))

export default useSpendingStore
