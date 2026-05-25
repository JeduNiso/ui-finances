import { create } from 'zustand'
import * as debtsApi from '../api/debts'

const useDebtsStore = create((set) => ({
  data: [],
  summary: null,
  isLoading: false,
  error: null,

  fetchDebts: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await debtsApi.getDebts(params)
      set({ data, isLoading: false })
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
    }
  },

  fetchSummary: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await debtsApi.getDebtSummary()
      set({ summary: data, isLoading: false })
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
    }
  },

  createDebt: async (payload) => {
    const { data } = await debtsApi.createDebt(payload)
    set((s) => ({ data: [...s.data, data] }))
    return data
  },

  updateDebt: async (id, payload) => {
    const { data } = await debtsApi.updateDebt(id, payload)
    set((s) => ({ data: s.data.map((x) => (x.id === id ? data : x)) }))
    return data
  },

  deleteDebt: async (id) => {
    await debtsApi.deleteDebt(id)
    set((s) => ({ data: s.data.filter((x) => x.id !== id) }))
  },

  addPayment: async (id, payload) => {
    const { data } = await debtsApi.addPayment(id, payload)
    set((s) => ({ data: s.data.map((x) => (x.id === id ? data : x)) }))
    return data
  },

  reset: () => set({ data: [], summary: null, isLoading: false, error: null }),
}))

export default useDebtsStore
