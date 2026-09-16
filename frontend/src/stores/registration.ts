import { createStore } from 'zustand/vanilla'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Registration } from '../types'

export interface RegistrationState {
  registration: Registration | null
  save: (registration: Registration) => void
  clear: () => void
}

function isRegistration(value: unknown): value is Registration {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    && Object.values(value).every(item => typeof item === 'string')
}

export const registrationStore = createStore<RegistrationState>()(
  persist(
    set => ({
      registration: null,
      save: registration => set({ registration }),
      clear: () => set({ registration: null }),
    }),
    {
      name: 'humg-demo-registration',
      storage: createJSONStorage(() => ({
        getItem: name => {
          const raw = localStorage.getItem(name)
          if (!raw) return null
          try {
            const value: unknown = JSON.parse(raw)
            // Preserve registrations saved before the Zustand migration.
            return isRegistration(value)
              ? JSON.stringify({ state: { registration: value }, version: 0 })
              : raw
          } catch { return null }
        },
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: name => localStorage.removeItem(name),
      })),
      partialize: state => ({ registration: state.registration }),
      merge: (persisted, current) => {
        const value = persisted && typeof persisted === 'object' && 'registration' in persisted
          ? persisted.registration : null
        return { ...current, registration: isRegistration(value) ? value : null }
      },
    },
  ),
)
