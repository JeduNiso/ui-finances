import { create } from 'zustand'
import { getDashboard } from '../api/dashboard'

const useDashboardStore = create((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetch: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await getDashboard()
      set({ data, isLoading: false })
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
    }
  },

  reset: () => set({ data: null, isLoading: false, error: null }),
}))

export default useDashboardStore
