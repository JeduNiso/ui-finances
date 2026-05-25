import { create } from 'zustand'
import * as expensesApi from '../api/expenses'

const useExpensesStore = create((set) => ({
  data: [],
  calendar: [],
  isLoading: false,
  error: null,

  fetchExpenses: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await expensesApi.getExpenses(params)
      set({ data, isLoading: false })
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
    }
  },

  fetchCalendar: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await expensesApi.getCalendar(params)
      set({ calendar: data, isLoading: false })
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
    }
  },

  createExpense: async (payload) => {
    const { data } = await expensesApi.createExpense(payload)
    set((s) => ({ data: [...s.data, data] }))
    return data
  },

  updateExpense: async (id, payload) => {
    const { data } = await expensesApi.updateExpense(id, payload)
    set((s) => ({ data: s.data.map((x) => (x.id === id ? data : x)) }))
    return data
  },

  deleteExpense: async (id) => {
    await expensesApi.deleteExpense(id)
    set((s) => ({ data: s.data.filter((x) => x.id !== id) }))
  },

  pay: async (id, payload) => {
    const { data } = await expensesApi.payExpense(id, payload)
    set((s) => ({ data: s.data.map((x) => (x.id === id ? data : x)) }))
    return data
  },

  reset: () => set({ data: [], calendar: [], isLoading: false, error: null }),
}))

export default useExpensesStore
