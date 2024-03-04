import { create } from 'zustand'

type SearchStoreState = {
  open: boolean
  toggleOpen: () => void
}

export const useSearchStore = create<SearchStoreState>((set, get) => ({
  open: false,
  toggleOpen: () => set({ open: !get().open }),
}))
