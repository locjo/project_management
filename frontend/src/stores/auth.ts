import { createStore } from 'zustand/vanilla'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AuthResponse, UserInfo } from '../types/api'

interface AuthState {
  accessToken: string | null
  user: UserInfo | null
  setSession: (session: AuthResponse) => void
  setAccessToken: (token: string) => void
  clear: () => void
}

export const authStore = createStore<AuthState>()(persist(set => ({
  accessToken: null,
  user: null,
  setSession: session => set({ accessToken: session.accessToken, user: session.user }),
  setAccessToken: accessToken => set({ accessToken }),
  clear: () => set({ accessToken: null, user: null }),
}), {
  name: 'humg-auth',
  storage: createJSONStorage(() => sessionStorage),
  partialize: state => ({ accessToken: state.accessToken, user: state.user }),
}))
