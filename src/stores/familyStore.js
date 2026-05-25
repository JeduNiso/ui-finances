import { create } from 'zustand'
import * as familyApi from '../api/family'

const useFamilyStore = create((set) => ({
  data: null,
  members: [],
  isLoading: false,
  error: null,

  fetchFamily: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await familyApi.getMyFamily()
      set({ data, isLoading: false })
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
    }
  },

  fetchMembers: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await familyApi.getMembers()
      set({ members: data, isLoading: false })
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
    }
  },

  createFamily: async (payload) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await familyApi.createFamily(payload)
      set({ data, isLoading: false })
      return data
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
      throw e
    }
  },

  invite: async (email) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await familyApi.inviteMember({ email })
      set((s) => ({ members: [...s.members, data], isLoading: false }))
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
      throw e
    }
  },

  remove: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      await familyApi.removeMember(userId)
      set((s) => ({ members: s.members.filter((m) => m.id !== userId), isLoading: false }))
    } catch (e) {
      set({ error: e.response?.data ?? e.message, isLoading: false })
      throw e
    }
  },

  reset: () => set({ data: null, members: [], isLoading: false, error: null }),
}))

export default useFamilyStore
