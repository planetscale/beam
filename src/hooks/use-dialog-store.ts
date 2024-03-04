import { type ReactNode } from 'react'
import { create } from 'zustand'

interface DialogState {
  isOpen: boolean
  onClose: () => void
  component: ReactNode
  handleDialog: ({ component }: { component: ReactNode }) => void
  handleDialogClose: () => void
}

export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  onClose: () => set(() => ({ isOpen: false })),
  component: null,
  handleDialog: ({ component }) => set({ component, isOpen: true }),
  handleDialogClose: () => set({ isOpen: false }),
}))
