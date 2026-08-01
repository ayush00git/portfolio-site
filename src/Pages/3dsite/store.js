import { create } from 'zustand'

/* Global interaction state for the Terminal Room.
   mode:
     'intro' — pointer not locked, brutalist title card shown
     'walk'  — pointer locked, WASD + mouse-look active
     'focus' — camera docked at the terminal, player frozen, keys go to bash
   hovered — crosshair is currently over the terminal hitbox */

export const useStation = create((set) => ({
  mode: 'intro',
  hovered: false,
  setMode: (mode) => set({ mode }),
  setHovered: (hovered) => set({ hovered }),
}))
