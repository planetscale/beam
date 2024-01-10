import { type ReactNode } from 'react'
import { create } from 'zustand'

interface DialogState {
  isOpen: boolean
  onClose: () => void
  dialogContent: React.ReactNode
  handleDialog: ({ content }: { content: ReactNode }) => void
  handleDialogClose: () => void
}

export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  onClose: () => set(() => ({ isOpen: false })),
  dialogContent: null,
  handleDialog: ({ content }) => set({ dialogContent: content, isOpen: true }),
  handleDialogClose: () => set({ isOpen: false }),
}))
