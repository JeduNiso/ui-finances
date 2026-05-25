import { create } from 'zustand'
import { getReport } from '../api/report'

const useReportStore = create((set) => ({
  transactions: [],
  summary: null,
  isLoading: false,
  error: null,

  fetchReport: async (params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await getReport(params)
      set({ transactions: data.transactions, summary: data.summary, isLoading: false })
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
    }
  },
}))

export default useReportStore
