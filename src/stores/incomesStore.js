import { create } from 'zustand'
import * as incomesApi from '../api/incomes'

const useIncomesStore = create((set) => ({
  data: [],
  isLoading: false,
  error: null,

  fetchIncomes: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await incomesApi.getIncomes(params)
      set({ data, isLoading: false })
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
    }
  },

  createIncome: async (payload) => {
    const { data } = await incomesApi.createIncome(payload)
    set((s) => ({ data: [data, ...s.data] }))
    return data
  },

  updateIncome: async (id, payload) => {
    const { data } = await incomesApi.updateIncome(id, payload)
    set((s) => ({ data: s.data.map((x) => (x.id === id ? data : x)) }))
    return data
  },

  deleteIncome: async (id) => {
    await incomesApi.deleteIncome(id)
    set((s) => ({ data: s.data.filter((x) => x.id !== id) }))
  },
}))

export default useIncomesStore
