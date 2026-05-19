import { create } from 'zustand'

interface ConversationsState {
  search: string
  setSearch: (search: string) => void
}

export const useConversationsStore = create<ConversationsState>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
}))
